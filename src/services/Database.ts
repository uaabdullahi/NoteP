import * as SQLite from 'expo-sqlite';
import { Note } from '../models/Note';

const DATABASE_NAME = 'notep.db';

export const initDatabase = async () => {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      dateTime TEXT NOT NULL,
      color INTEGER NOT NULL,
      isPinned INTEGER DEFAULT 0
    );
  `);
    return db;
};

export const insertNote = async (db: SQLite.SQLiteDatabase, note: Omit<Note, 'id'>) => {
    const result = await db.runAsync(
        'INSERT INTO notes (title, content, dateTime, color, isPinned) VALUES (?, ?, ?, ?, ?)',
        [note.title, note.content, note.dateTime, note.color, note.isPinned ? 1 : 0]
    );
    return result.lastInsertRowId;
};

export const getNotes = async (db: SQLite.SQLiteDatabase): Promise<Note[]> => {
    const notes = await db.getAllAsync<any>('SELECT * FROM notes ORDER BY isPinned DESC, dateTime DESC');
    return notes.map(row => ({
        ...row,
        isPinned: row.isPinned === 1,
    }));
};

export const updateNote = async (db: SQLite.SQLiteDatabase, note: Note) => {
    await db.runAsync(
        'UPDATE notes SET title = ?, content = ?, dateTime = ?, color = ?, isPinned = ? WHERE id = ?',
        [note.title, note.content, note.dateTime, note.color, note.isPinned ? 1 : 0, note.id!]
    );
};

export const deleteNote = async (db: SQLite.SQLiteDatabase, id: number) => {
    await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
};

export const searchNotes = async (db: SQLite.SQLiteDatabase, query: string): Promise<Note[]> => {
    const notes = await db.getAllAsync<any>(
        'SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY isPinned DESC, dateTime DESC',
        [`%${query}%`, `%${query}%`]
    );
    return notes.map(row => ({
        ...row,
        isPinned: row.isPinned === 1,
    }));
};
