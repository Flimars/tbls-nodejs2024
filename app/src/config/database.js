import Database from 'better-sqlite3';

import { dir } from '../dirroot.js';
console.log({ dir });

// faz o caminho ser AGNOSTICO ao Sistema operacional
// import path from 'path';
// const pathDB = path.join(dir, '..', 'dados.db');
// console.log({ pathDB });

const db = new Database('dados.db', {
   verbose: console.log 
});

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        avatar_url TEXT,
        created_at TEXT 
    )
`);

// Cria a tabela de telefones
db.prepare(`
  CREATE TABLE IF NOT EXISTS phones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    phone TEXT NOT NULL,
    is_primary INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`).run();

// Cria a tabela de emails
db.prepare(`
  CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    is_primary INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`).run();

export {
    db
}