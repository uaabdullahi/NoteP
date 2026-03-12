import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SQLite from 'expo-sqlite';
import { Note } from '../models/Note';
import { initDatabase, getNotes, insertNote, updateNote, deleteNote, searchNotes } from '../services/Database';

interface NoteContextType {
    notes: Note[];
    loading: boolean;
    addNote: (note: Omit<Note, 'id'>) => Promise<void>;
    editNote: (note: Note) => Promise<void>;
    removeNote: (id: number) => Promise<void>;
    findNotes: (query: string) => Promise<void>;
    refreshNotes: () => Promise<void>;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const setup = async () => {
            try {
                const database = await initDatabase();
                setDb(database);
                const allNotes = await getNotes(database);
                setNotes(allNotes);
            } catch (error) {
                console.error('Failed to initialize database', error);
            } finally {
                setLoading(false);
            }
        };
        setup();
    }, []);

    const refreshNotes = useCallback(async () => {
        if (!db) return;
        setLoading(true);
        try {
            const allNotes = await getNotes(db);
            setNotes(allNotes);
        } catch (error) {
            console.error('Failed to refresh notes', error);
        } finally {
            setLoading(false);
        }
    }, [db]);

    const addNote = async (note: Omit<Note, 'id'>) => {
        if (!db) return;
        try {
            await insertNote(db, note);
            await refreshNotes();
        } catch (error) {
            console.error('Failed to add note', error);
            throw error;
        }
    };

    const editNote = async (note: Note) => {
        if (!db) return;
        try {
            await updateNote(db, note);
            await refreshNotes();
        } catch (error) {
            console.error('Failed to update note', error);
            throw error;
        }
    };

    const removeNote = async (id: number) => {
        if (!db) return;
        try {
            await deleteNote(db, id);
            await refreshNotes();
        } catch (error) {
            console.error('Failed to delete note', error);
            throw error;
        }
    };

    const findNotes = async (query: string) => {
        if (!db) return;
        setLoading(true);
        try {
            if (!query.trim()) {
                await refreshNotes();
            } else {
                const results = await searchNotes(db, query);
                setNotes(results);
            }
        } catch (error) {
            console.error('Failed to search notes', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <NoteContext.Provider value={{ notes, loading, addNote, editNote, removeNote, findNotes, refreshNotes }}>
            {children}
        </NoteContext.Provider>
    );
};

export const useNotes = () => {
    const context = useContext(NoteContext);
    if (context === undefined) {
        throw new Error('useNotes must be used within a NoteProvider');
    }
    return context;
};
