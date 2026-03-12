import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ArrowLeft, Pin, Trash2, Check } from 'lucide-react-native';
import { useNotes } from '../context/NoteContext';
import { Colors } from '../constants/Colors';
import { RootStackParamList } from '../models/navigation';

type EditorScreenRouteProp = RouteProp<RootStackParamList, 'Editor'>;

export const EditorScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<EditorScreenRouteProp>();
    const { addNote, editNote, removeNote } = useNotes();

    const existingNote = route.params?.note;

    const [title, setTitle] = useState(existingNote?.title || '');
    const [content, setContent] = useState(existingNote?.content || '');
    const [selectedColorIndex, setSelectedColorIndex] = useState(existingNote?.color ?? 0);
    const [isPinned, setIsPinned] = useState(existingNote?.isPinned || false);

    const handleSave = async () => {
        if (!title.trim() && !content.trim()) {
            navigation.goBack();
            return;
        }

        const noteData = {
            title: title.trim() || 'Untitled',
            content: content.trim(),
            dateTime: new Date().toISOString(),
            color: selectedColorIndex,
            isPinned: isPinned,
        };

        try {
            if (existingNote?.id) {
                await editNote({ ...noteData, id: existingNote.id });
            } else {
                await addNote(noteData);
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save note');
        }
    };

    const handleDelete = () => {
        if (!existingNote?.id) return;

        Alert.alert(
            'Delete Note',
            'Are you sure you want to delete this note?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await removeNote(existingNote.id!);
                        navigation.goBack();
                    }
                },
            ]
        );
    };

    const noteColor = Colors.noteColors[selectedColorIndex];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: noteColor }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleSave} style={styles.iconButton}>
                        <ArrowLeft color="#FFFFFF" size={24} />
                    </TouchableOpacity>

                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            onPress={() => setIsPinned(!isPinned)}
                            style={styles.iconButton}
                        >
                            <Pin
                                color="#FFFFFF"
                                size={24}
                                fill={isPinned ? '#FFFFFF' : 'transparent'}
                            />
                        </TouchableOpacity>

                        {existingNote?.id && (
                            <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                                <Trash2 color="#FFFFFF" size={24} />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity onPress={handleSave} style={styles.iconButton}>
                            <Check color="#FFFFFF" size={24} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Title"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={title}
                        onChangeText={setTitle}
                        multiline
                    />

                    <TextInput
                        style={styles.contentInput}
                        placeholder="Start typing..."
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        textAlignVertical="top"
                    />
                </ScrollView>

                <View style={styles.colorPickerContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorList}>
                        {Colors.noteColors.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedColorIndex(index)}
                                style={[
                                    styles.colorBubble,
                                    { backgroundColor: color },
                                    selectedColorIndex === index && styles.selectedColorBubble
                                ]}
                            >
                                {selectedColorIndex === index && (
                                    <View style={styles.selectedIndicator} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerActions: {
        flexDirection: 'row',
    },
    iconButton: {
        padding: 8,
        marginLeft: 8,
    },
    scrollContent: {
        padding: 24,
        flexGrow: 1,
    },
    titleInput: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    contentInput: {
        fontSize: 18,
        color: '#FFFFFF',
        lineHeight: 28,
        flex: 1,
    },
    colorPickerContainer: {
        height: 80,
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingVertical: 16,
    },
    colorList: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    colorBubble: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColorBubble: {
        borderColor: '#FFFFFF',
    },
    selectedIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
});
