import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";

// One SQLite file on the mounted volume: /data survives a restart or a
// redeploy, nothing else does (see fly.toml). DATA_DIR overrides it for a
// local run, where there's no volume.
const dataDir = process.env.DATA_DIR ?? "/data";
mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(`${dataDir}/marks.sqlite`);

db.exec(`
  create table if not exists marks (
    id integer primary key autoincrement,
    visitor_id text not null,
    name text not null,
    body text not null,
    created_at text not null
  );
  create table if not exists visitors (
    visitor_id text primary key,
    seen_id integer not null
  )
`);

export interface Mark {
  id: number;
  visitor_id: string;
  name: string;
  body: string;
  created_at: string;
}

const insertStmt = db.prepare(
  "insert into marks (visitor_id, name, body, created_at) values (?, ?, ?, ?)",
);
const listStmt = db.prepare("select * from marks order by id desc");
const getStmt = db.prepare("select * from marks where id = ?");
const afterStmt = db.prepare("select * from marks where id > ? order by id asc");
const seenGetStmt = db.prepare("select seen_id from visitors where visitor_id = ?");
// max(), so a late-arriving delivery for an older mark never moves it back
const seenSetStmt = db.prepare(`
  insert into visitors (visitor_id, seen_id) values (?, ?)
  on conflict (visitor_id) do update set seen_id = max(seen_id, excluded.seen_id)
`);

export function insertMark(visitorId: string, name: string, body: string): Mark {
  const { lastInsertRowid } = insertStmt.run(visitorId, name, body, new Date().toISOString());
  return getStmt.get(lastInsertRowid) as unknown as Mark;
}

export function listMarks(): Mark[] {
  return listStmt.all() as unknown as Mark[];
}

// The table doubles as the replay log for a reconnecting live connection.
export function marksAfter(id: number): Mark[] {
  return afterStmt.all(id) as unknown as Mark[];
}

// The highest mark id this visitor has had in front of them, on a page load
// or a live delivery; undefined on a first visit.
export function getSeen(visitorId: string): number | undefined {
  const row = seenGetStmt.get(visitorId) as { seen_id: number } | undefined;
  return row?.seen_id;
}

export function markSeen(visitorId: string, id: number): void {
  seenSetStmt.run(visitorId, id);
}
