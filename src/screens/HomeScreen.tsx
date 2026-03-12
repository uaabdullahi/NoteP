import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Search, X, Plus, NotepadText } from 'lucide-react-native';
import { useNotes } from '../context/NoteContext';
import { NoteCard } from '../components/NoteCard';
import { Colors } from '../constants/Colors';
import { RootStackParamList } from '../models/navigation';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

export const HomeScreen = () => {
    const { notes, loading, findNotes } = useNotes();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        findNotes(query);
    };

    const toggleSearch = () => {
        if (isSearching) {
            setSearchQuery('');
            findNotes('');
        }
        setIsSearching(!isSearching);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {isSearching ? (
                    <View style={styles.searchBar}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search notes..."
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={searchQuery}
                            onChangeText={handleSearch}
                            autoFocus
                        />
                        <TouchableOpacity onPress={toggleSearch}>
                            <X color="#FFFFFF" size={24} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>NoteP</Text>
                        <TouchableOpacity onPress={toggleSearch}>
                            <Search color="#FFFFFF" size={24} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {notes.length === 0 && !loading ? (
                <View style={styles.emptyContainer}>
                    <NotepadText size={100} color="rgba(255,255,255,0.05)" />
                    <Text style={styles.emptyText}>No notes yet</Text>
                </View>
            ) : (
                <FlatList
                    data={notes}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    renderItem={({ item }) => (
                        <View style={{ width: COLUMN_WIDTH }}>
                            <NoteCard
                                note={item}
                                onTap={() => navigation.navigate('Editor', { note: item })}
                            />
                        </View>
                    )}
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('Editor', {})}
            >
                <Plus color="#FFFFFF" size={32} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        height: 80,
        justifyContent: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 1.2,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        marginRight: 8,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 18,
        color: 'rgba(255,255,255,0.3)',
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});
