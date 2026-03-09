import 'package:flutter/material.dart';
import '../models/note.dart';
import '../services/database_helper.dart';

class NoteProvider with ChangeNotifier {
  List<Note> _notes = [];
  String _searchQuery = '';
  final DatabaseHelper _dbHelper = DatabaseHelper();

  List<Note> get notes {
    if (_searchQuery.isEmpty) {
      return _notes;
    } else {
      return _notes.where((note) =>
        note.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
        note.content.toLowerCase().contains(_searchQuery.toLowerCase())
      ).toList();
    }
  }

  Future<void> fetchNotes() async {
    _notes = await _dbHelper.getNotes();
    notifyListeners();
  }

  Future<void> addNote(Note note) async {
    await _dbHelper.insertNote(note);
    await fetchNotes();
  }

  Future<void> updateNote(Note note) async {
    await _dbHelper.updateNote(note);
    await fetchNotes();
  }

  Future<void> deleteNote(int id) async {
    await _dbHelper.deleteNote(id);
    await fetchNotes();
  }

  Future<void> togglePin(Note note) async {
    final updatedNote = note.copyWith(isPinned: !note.isPinned);
    await updateNote(updatedNote);
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }
}
