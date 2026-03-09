class Note {
  final int? id;
  final String title;
  final String content;
  final DateTime dateTime;
  final int color;
  final bool isPinned;

  Note({
    this.id,
    required this.title,
    required this.content,
    required this.dateTime,
    required this.color,
    this.isPinned = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'dateTime': dateTime.toIso8601String(),
      'color': color,
      'isPinned': isPinned ? 1 : 0,
    };
  }

  factory Note.fromMap(Map<String, dynamic> map) {
    return Note(
      id: map['id'],
      title: map['title'],
      content: map['content'],
      dateTime: DateTime.parse(map['dateTime']),
      color: map['color'],
      isPinned: map['isPinned'] == 1,
    );
  }

  Note copyWith({
    int? id,
    String? title,
    String? content,
    DateTime? dateTime,
    int? color,
    bool? isPinned,
  }) {
    return Note(
      id: id ?? this.id,
      title: title ?? this.title,
      content: content ?? this.content,
      dateTime: dateTime ?? this.dateTime,
      color: color ?? this.color,
      isPinned: isPinned ?? this.isPinned,
    );
  }
}
