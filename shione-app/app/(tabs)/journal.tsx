import { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Modal, 
    TextInput, 
    ScrollView,
    RefreshControl,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createJournal, getJournals, updateJournal, deleteJournal } from '@/api/journal.api';
import { getHomeData } from '@/api/home.api';

type Journal = {
    id?: number;
    title: string;
    content: string;
    createdAt?: string;
};

export default function JournalScreen() {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    
    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
    
    // Form fields
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // ─── LOAD JOURNALS (tries list, falls back to single) ───
    const loadJournals = async () => {
        try {
            // Try getting all journals first
            const data = await getJournals();
            
            if (Array.isArray(data) && data.length > 0) {
                setJournals(data);
                return;
            }
            
            // If single object returned, wrap it
            if (data && typeof data === 'object' && data.title) {
                setJournals([data]);
                return;
            }
            
            // Fallback: use getHomeData (which we KNOW works)
            const homeData = await getHomeData();
            if (homeData?.journal) {
                setJournals([homeData.journal]);
            } else {
                setJournals([]);
            }
            
        } catch (error) {
            console.log('getJournals failed, using fallback:', error);
            
            // Last resort: getHomeData
            try {
                const homeData = await getHomeData();
                if (homeData?.journal) {
                    setJournals([homeData.journal]);
                } else {
                    setJournals([]);
                }
            } catch (e) {
                setJournals([]);
            }
        }
    };

    useEffect(() => {
        loadJournals();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadJournals().finally(() => setRefreshing(false));
    }, []);

    // ─── MODAL ACTIONS ───
    const openCreate = () => {
        setSelectedId(undefined);
        setTitle('');
        setContent('');
        setIsEditing(false);
        setModalVisible(true);
    };

    const openEdit = (journal: Journal) => {
        setSelectedId(journal.id);
        setTitle(journal.title);
        setContent(journal.content);
        setIsEditing(true);
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('Oops', 'Please fill in both fields');
            return;
        }

        try {
            if (isEditing && selectedId) {
                await updateJournal(selectedId, title, content);
                Alert.alert('Saved!', 'Journal updated');
            } else {
                await createJournal(title, content);
                Alert.alert('Created!', 'New journal saved');
            }
            
            setModalVisible(false);
            setTitle('');
            setContent('');
            await loadJournals(); // Refresh the list
        } catch (error) {
            Alert.alert('Error', 'Failed to save');
        }
    };

    const handleDelete = () => {
        if (!selectedId) return;
        Alert.alert('Delete?', 'This cannot be undone', [
            { text: 'Cancel', style: 'cancel' },
            { 
                text: 'Delete', 
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteJournal(selectedId);
                        setModalVisible(false);
                        await loadJournals();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete');
                    }
                }
            }
        ]);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Today';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    // ─── RENDER ───
    const hasJournals = journals.length > 0;

    return (
        <SafeAreaView className="flex-1 bg-[#FBF7FF]">
            
            {/* Header */}
            <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
                <View>
                    <Text className="text-2xl font-bold text-neutral-800">My Journal</Text>
                    <Text className="text-sm text-neutral-400 mt-1">
                        {hasJournals ? `${journals.length} entries` : 'Start writing'}
                    </Text>
                </View>
                
                <TouchableOpacity 
                    onPress={openCreate}
                    className="w-10 h-10 rounded-full bg-[#8854C0] items-center justify-center"
                    style={{
                        shadowColor: '#8854C0',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                    }}
                >
                    <Feather name="plus" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Journal List */}
            <ScrollView 
                className="flex-1 px-5 pt-4" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8854C0" colors={["#8854C0"]} />
                }
            >
                {hasJournals ? (
                    journals.map((journal, index) => (
                        <TouchableOpacity
                            key={journal.id ?? index}
                            onPress={() => openEdit(journal)}
                            activeOpacity={0.8}
                            className="bg-white rounded-2xl p-5 border border-neutral-100 mb-3"
                            style={{
                                shadowColor: '#8854C0',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.06,
                                shadowRadius: 8,
                                elevation: 2,
                            }}
                        >
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="px-2.5 py-1 rounded-full bg-[#8854C0]/10">
                                    <Text className="text-[10px] font-bold text-[#8854C0]">
                                        {formatDate(journal.createdAt)}
                                    </Text>
                                </View>
                                <Feather name="edit-2" size={16} color="#C4B5FD" />
                            </View>

                            <Text className="text-lg font-bold text-neutral-800 mb-1" numberOfLines={1}>
                                {journal.title}
                            </Text>
                            <Text className="text-sm text-neutral-500 leading-5" numberOfLines={2}>
                                {journal.content}
                            </Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    /* ─── EMPTY STATE ─── */
                    <View className="items-center justify-center pt-20">
                        <View className="w-20 h-20 rounded-full bg-[#8854C0]/10 items-center justify-center mb-5">
                            <Feather name="book" size={32} color="#8854C0" />
                        </View>
                        <Text className="text-lg font-bold text-neutral-800 mb-2">
                            No journal entries yet
                        </Text>
                        <Text className="text-sm text-neutral-400 text-center mb-8 px-4">
                            Tap the + button to write your first journal.
                        </Text>
                        <TouchableOpacity 
                            onPress={openCreate}
                            className="flex-row items-center gap-2 bg-[#8854C0] px-6 py-3.5 rounded-2xl"
                        >
                            <Feather name="edit-3" size={18} color="white" />
                            <Text className="text-white font-bold text-base">
                                Write First Journal
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* ─── CREATE / EDIT MODAL ─── */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <View className="flex-1 bg-black/40 justify-end">
                        <View className="bg-white rounded-t-3xl p-6 pb-10 max-h-[90%]">
                            
                            {/* Header */}
                            <View className="flex-row items-center justify-between mb-6">
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text className="text-neutral-400 font-semibold">Cancel</Text>
                                </TouchableOpacity>
                                
                                <Text className="text-lg font-bold text-neutral-800">
                                    {isEditing ? 'Edit Entry' : 'New Entry'}
                                </Text>
                                
                                <TouchableOpacity onPress={handleSave}>
                                    <Text className="text-[#8854C0] font-bold">Save</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Title */}
                            <Text className="text-sm font-semibold text-neutral-600 mb-2 ml-1">Title</Text>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                placeholder="What's this about?"
                                placeholderTextColor="#A3A3A3"
                                className="bg-neutral-50 rounded-xl px-4 py-3.5 text-neutral-800 text-base font-semibold mb-5 border border-neutral-200"
                            />

                            {/* Content */}
                            <Text className="text-sm font-semibold text-neutral-600 mb-2 ml-1">Your Thoughts</Text>
                            <ScrollView className="max-h-[400]">
                                <TextInput
                                    value={content}
                                    onChangeText={setContent}
                                    placeholder="Write freely..."
                                    placeholderTextColor="#A3A3A3"
                                    multiline
                                    textAlignVertical="top"
                                    className="bg-neutral-50 rounded-xl px-4 py-4 text-neutral-700 text-base leading-6 border border-neutral-200"
                                    style={{ minHeight: 250 }}
                                />
                            </ScrollView>

                            {/* Delete (only when editing) */}
                            {isEditing && (
                                <TouchableOpacity
                                    onPress={handleDelete}
                                    className="mt-6 py-3 rounded-xl items-center flex-row justify-center gap-2 bg-red-50 border border-red-100"
                                >
                                    <Feather name="trash-2" size={16} color="#EF4444" />
                                    <Text className="text-red-500 font-semibold">Delete Entry</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

        </SafeAreaView>
    );
}