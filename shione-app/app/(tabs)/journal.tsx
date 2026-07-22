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
    Alert,
    Animated,
    Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { createJournal, getJournals, updateJournal, deleteJournal } from '@/api/journal.api';
import { getHomeData } from '@/api/home.api';

type Journal = {
    id?: number;
    title: string;
    content: string;
    createdAt?: string;
};

const { width } = Dimensions.get('window');

export default function JournalScreen() {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [contentHeight, setContentHeight] = useState(250);

    const loadJournals = async () => {
        try {
            const data = await getJournals();
            
            if (Array.isArray(data) && data.length > 0) {
                setJournals(data);
                return;
            }
            
            if (data && typeof data === 'object' && data.title) {
                setJournals([data]);
                return;
            }
            
            const homeData = await getHomeData();
            if (homeData?.journal) {
                setJournals([homeData.journal]);
            } else {
                setJournals([]);
            }
            
        } catch (error) {
            console.log('getJournals failed, using fallback:', error);
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

    const openCreate = () => {
        setSelectedId(undefined);
        setTitle('');
        setContent('');
        setContentHeight(250);
        setIsEditing(false);
        setModalVisible(true);
    };

    const openEdit = (journal: Journal) => {
        setSelectedId(journal.id);
        setTitle(journal.title);
        setContent(journal.content);
        setContentHeight(250);
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
            await loadJournals();
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

    const hasJournals = journals.length > 0;

    return (
        <SafeAreaView className="flex-1 bg-[#FBF7FF]">
            {/* Background Decorative Circles */}
            <View className="absolute top-0 left-0 right-0 h-full pointer-events-none overflow-hidden">
                <LinearGradient
                    colors={["rgba(136,84,192,0.06)", "transparent"]}
                    className="absolute top-0 left-0 right-0 h-96"
                />
                <View
                    className="absolute top-16 -right-16 w-64 h-64 rounded-full"
                    style={{ backgroundColor: "rgba(136,84,192,0.06)" }}
                />
                <View
                    className="absolute top-48 -left-12 w-48 h-48 rounded-full"
                    style={{ backgroundColor: "rgba(167,139,250,0.05)" }}
                />
                <View
                    className="absolute bottom-32 right-8 w-32 h-32 rounded-full"
                    style={{ backgroundColor: "rgba(136,84,192,0.04)" }}
                />
            </View>

            {/* Header */}
            <View className="px-5 pt-4 pb-2 flex-row items-center justify-between z-10">
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
                className="flex-1 px-5 pt-4 z-10" 
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
                            activeOpacity={0.85}
                            className="mb-4"
                            style={{
                                shadowColor: '#8854C0',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.08,
                                shadowRadius: 16,
                                elevation: 3,
                            }}
                        >
                            <BlurView
                                intensity={50}
                                tint="light"
                                className="rounded-3xl overflow-hidden border border-white/50"
                            >
                                <View className="flex-row">
                                    {/* Left Purple Accent Bar */}
                                    <View 
                                        className="w-1.5 rounded-full my-4 ml-4"
                                        style={{ backgroundColor: '#8854C0' }}
                                    />
                                    
                                    <View className="flex-1 p-5 pl-4">
                                        <View className="flex-row items-center justify-between mb-3">
                                            <View className="flex-row items-center gap-2">
                                                <Feather name="calendar" size={12} color="#8854C0" />
                                                <Text className="text-[11px] font-bold text-[#8854C0] uppercase tracking-wider">
                                                    {formatDate(journal.createdAt)}
                                                </Text>
                                            </View>
                                            <View className="w-8 h-8 rounded-full bg-[#8854C0]/5 items-center justify-center">
                                                <Feather name="edit-3" size={14} color="#8854C0" />
                                            </View>
                                        </View>

                                        <Text className="text-lg font-bold text-neutral-800 mb-2 leading-tight" numberOfLines={1}>
                                            {journal.title}
                                        </Text>
                                        
                                        <Text className="text-sm text-neutral-500 leading-6" numberOfLines={3}>
                                            {journal.content}
                                        </Text>
                                        
                                        <View className="flex-row items-center mt-3 pt-3 border-t border-neutral-100">
                                            <Text className="text-[11px] text-neutral-400 font-medium">
                                                Tap to read or edit
                                            </Text>
                                            <Feather name="arrow-right" size={12} color="#C4B5FD" className="ml-1" />
                                        </View>
                                    </View>
                                </View>
                            </BlurView>
                        </TouchableOpacity>
                    ))
                ) : (
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
                            style={{
                                shadowColor: '#8854C0',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.25,
                                shadowRadius: 12,
                                elevation: 4,
                            }}
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
                        <View className="bg-white rounded-t-3xl px-6 pt-5 pb-10" style={{ maxHeight: '92%' }}>
                            
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
                                placeholder="Give your entry a title..."
                                placeholderTextColor="#A3A3A3"
                                className="bg-neutral-50 rounded-2xl px-4 py-3.5 text-neutral-800 text-base font-semibold mb-5 border border-neutral-200"
                            />

                           {/* Content - Expansive Writing Area */}
<Text className="text-sm font-semibold text-neutral-600 mb-2 ml-1">
    Your Thoughts
</Text>

<ScrollView 
    className="bg-neutral-50 rounded-2xl border border-neutral-200"
    contentContainerStyle={{ minHeight: 280 }}
    showsVerticalScrollIndicator={true}
>
    <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Write freely. There's no limit to what you can express..."
        placeholderTextColor="#A3A3A3"
        multiline
        textAlignVertical="top"
        className="px-4 py-4 text-neutral-700 text-base leading-7"
        style={{ minHeight: 280 }}
    />
</ScrollView>

<View className="flex-row justify-between items-center mt-3 px-1 mb-2">
    <Text className="text-[11px] text-neutral-400">
        {content.length} characters
    </Text>
    <Text className="text-[11px] text-neutral-400">
        Write as much as you need
    </Text>
</View>

                            {/* Delete (only when editing) */}
                            {isEditing && (
                                <TouchableOpacity
                                    onPress={handleDelete}
                                    className="mt-6 py-3.5 rounded-2xl items-center flex-row justify-center gap-2 bg-red-50 border border-red-100"
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