import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Pin } from 'lucide-react-native';
import { Note } from '../models/Note';
import { Colors } from '../constants/Colors';

interface NoteCardProps {
    note: Note;
    onTap: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onTap }) => {
    const noteColor = Colors.noteColors[note.color] || Colors.noteColors[0];

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: `${noteColor}26`, // 15% opacity
                    borderColor: `${noteColor}4D`, // 30% opacity
                }
            ]}
            onPress={onTap}
            activeOpacity={0.7}
        >
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>
                        {note.title || 'Untitled'}
                    </Text>
                    {note.isPinned && (
                        <Pin size={14} color="rgba(255,255,255,0.7)" fill="rgba(255,255,255,0.7)" />
                    )}
                </View>

                <Text style={styles.content} numberOfLines={6}>
                    {note.content}
                </Text>

                <Text style={styles.date}>
                    {format(new Date(note.dateTime), 'MMM d, yyyy')}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 16,
        // Note: Masonry spacing handled by parent
    },
    contentContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
        marginRight: 4,
    },
    content: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 12,
        lineHeight: 20,
    },
    date: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },
});
