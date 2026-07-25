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
    Dimensions,
    SectionList,
    ActivityIndicator
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
    createdAt: string;
};

const { width } = Dimensions.get('window');

const groupJournalsByDate = (journals: Journal[]) => {
    const sortedJournals = [...journals].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const grouped: Record<string, Journal[]> = {};

    sortedJournals.forEach((journal) => {
        const date = new Date(journal.createdAt);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        let title = date.toLocaleDateString("en-US", {
         month: "long",
         day: "numeric",
         year: "numeric",
        });

        if (date.toDateString() === today.toDateString()) {
            title = "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            title = "Yesterday";
        }

        if (!grouped[title]) {
            grouped[title] = [];
        }

        grouped[title].push(journal);
    });

    const priority: Record<string, number> = { Today: 0, Yesterday: 1 };

    return Object.entries(grouped)
        .map(([title, data]) => ({ title, data }))
        .sort((a, b) => {
            const aP = priority[a.title];
            const bP = priority[b.title];
            if (aP !== undefined && bP !== undefined) return aP - bP;
            if (aP !== undefined) return -1;
            if (bP !== undefined) return 1;
            return (
                new Date(b.data[0].createdAt).getTime() -
                new Date(a.data[0].createdAt).getTime()
            );
        });
};

export default function JournalScreen() {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");

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
        } finally {
            setIsLoading(false);
        }
    };

    const filteredJournals = journals.filter((journal) => {
    const keyword = search.toLowerCase();

    return (
        journal.title.toLowerCase().includes(keyword) ||
        journal.content.toLowerCase().includes(keyword)
    );
});
 const sections = groupJournalsByDate(filteredJournals);

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

    const formatTime = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const hasJournals = journals.length > 0;
    const hasSearchResults = sections.length > 0;
    const isSearching = search.trim().length > 0;

    const getDotColor = (sectionIndex: number, totalSections: number) => {
        const opacity = Math.max(0.3, 1 - (sectionIndex / totalSections) * 0.7);
        return `rgba(136, 84, 192, ${opacity})`;
    };

    const renderTimelineItem = ({
        item,
        index,
        section
    }: {
        item: Journal;
        index: number;
        section: { title: string; data: Journal[] };
    }) => {
        const isLastInSection = index === section.data.length - 1;
        const sectionIndex = sections.findIndex((s) => s.title === section.title);

        return (
            <View className="flex-row">
                {/* Timeline Column */}
                <View className="items-center" style={{ width: 32 }}>
                    {/* Connecting line to next entry */}
                    {!isLastInSection && (
                        <View
                            className="absolute top-8 bottom-0 w-[2px]"
                            style={{
                                backgroundColor: 'rgba(136,84,192,0.15)',
                                left: 15
                            }}
                        />
                    )}
                    {/* Dot */}
                    <View
                        className="w-6 h-6 rounded-full items-center justify-center mt-6"
                        style={{
                            backgroundColor: getDotColor(sectionIndex, sections.length),
                            shadowColor: '#8854C0',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4
                        }}
                    >
                        <View className="w-2 h-2 rounded-full bg-white" />
                    </View>
                </View>

                {/* Card */}
                <View className="flex-1 ml-3">
                    <TouchableOpacity
                        onPress={() => openEdit(item)}
                        activeOpacity={0.85}
                        className="mb-4"
                        style={{
                            shadowColor: '#8854C0',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.08,
                            shadowRadius: 16,
                            elevation: 3
                        }}
                    >
                        <BlurView
                            intensity={50}
                            tint="light"
                            className="rounded-2xl overflow-hidden border border-white/50"
                        >
                            <View className="p-4">
                                <View className="flex-row items-center justify-between mb-3">
                                    <View className="flex-row items-center gap-2">
                                        <Feather name="clock" size={11} color="#8854C0" />
                                        <Text className="text-[11px] font-bold text-[#8854C0]">
                                            {formatTime(item.createdAt)}
                                        </Text>
                                    </View>
                                    <View className="w-7 h-7 rounded-full bg-[#8854C0]/5 items-center justify-center">
                                        <Feather name="edit-3" size={12} color="#8854C0" />
                                    </View>
                                </View>

                                <Text
                                    className="text-base font-bold text-neutral-800 mb-1.5 leading-tight"
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>

                                <Text
                                    className="text-sm text-neutral-500 leading-6"
                                    numberOfLines={3}
                                >
                                    {item.content}
                                </Text>

                                <View className="flex-row items-center mt-3 pt-3 border-t border-neutral-100">
                                    <Text className="text-[11px] text-neutral-400 font-medium">
                                        Tap to read or edit
                                    </Text>
                                    <Feather
                                        name="arrow-right"
                                        size={11}
                                        color="#C4B5FD"
                                        style={{ marginLeft: 4 }}
                                    />
                                </View>
                            </View>
                        </BlurView>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderSectionHeader = ({ section }: { section: { title: string } }) => (
        <View className="flex-row items-center mb-2 mt-4">
            <Text className="text-xs font-bold text-[#8854C0] uppercase tracking-wider mr-3">
                {section.title}
            </Text>
            <View className="flex-1 h-[1px] bg-[#8854C0]/10" />
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#FBF7FF]">
            {/* Background Decorative Circles */}
            <View className="absolute top-0 left-0 right-0 h-full pointer-events-none overflow-hidden">
                <LinearGradient
                    colors={['rgba(136,84,192,0.06)', 'transparent']}
                    className="absolute top-0 left-0 right-0 h-96"
                />
                <View
                    className="absolute top-16 -right-16 w-64 h-64 rounded-full"
                    style={{ backgroundColor: 'rgba(136,84,192,0.06)' }}
                />
                <View
                    className="absolute top-48 -left-12 w-48 h-48 rounded-full"
                    style={{ backgroundColor: 'rgba(167,139,250,0.05)' }}
                />
                <View
                    className="absolute bottom-32 right-8 w-32 h-32 rounded-full"
                    style={{ backgroundColor: 'rgba(136,84,192,0.04)' }}
                />
            </View>

            {/* Header */}
            <View className="px-5 pt-4 pb-2 flex-row items-center justify-between z-10">
                <View>
                    <Text className="text-2xl font-bold text-neutral-800">My Journals</Text>
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
                        elevation: 4
                    }}
                >
                    <Feather name="plus" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            {!isLoading && hasJournals && (
                <View className="px-5 pb-3 z-10">
                    <View
                        className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-purple-100"
                        style={{
                            shadowColor: '#8854C0',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 8,
                            elevation: 2,
                        }}
                    >
                        <Feather name="search" size={16} color="#C4B5FD" />
                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Search your journals..."
                            placeholderTextColor="#B79CE0"
                            className="flex-1 ml-2.5 text-[14px] text-neutral-700"
                        />
                        {search.length > 0 && (
                            <TouchableOpacity onPress={() => setSearch("")} hitSlop={8}>
                                <Feather name="x" size={16} color="#C4B5FD" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            {/* Content */}
            {isLoading ? (
                <View className="flex-1 items-center justify-center z-10">
                    <ActivityIndicator size="small" color="#8854C0" />
                    <Text className="text-sm text-neutral-400 mt-3">
                        Loading your journals...
                    </Text>
                </View>
            ) : hasJournals ? (
                hasSearchResults ? (
                    <SectionList
                        sections={sections}
                        keyExtractor={(item, index) => `${item.id ?? index}`}
                        renderItem={renderTimelineItem}
                        renderSectionHeader={renderSectionHeader}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#8854C0"
                                colors={['#8854C0']}
                            />
                        }
                    />
                ) : (
                    // isSearching is always true here, since hasJournals is true
                    // and hasSearchResults only comes up false when the search
                    // keyword matches nothing
                    <View className="flex-1 items-center justify-center px-8 z-10" style={{ marginTop: -80 }}>
                        <View className="w-16 h-16 rounded-full bg-[#8854C0]/10 items-center justify-center mb-4">
                            <Feather name="search" size={26} color="#8854C0" />
                        </View>
                        <Text className="text-base font-bold text-neutral-800 mb-1">
                            No matching entries
                        </Text>
                        <Text className="text-sm text-neutral-400 text-center">
                            Try a different word or clear your search.
                        </Text>
                    </View>
                )
            ) : (
                <ScrollView
                    className="flex-1 px-5 pt-4 z-10"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 140 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#8854C0"
                            colors={['#8854C0']}
                        />
                    }
                >
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
                                elevation: 4
                            }}
                        >
                            <Feather name="edit-3" size={18} color="white" />
                            <Text className="text-white font-bold text-base">
                                Write First Journal
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

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
                        <View
                            className="bg-white rounded-t-3xl px-6 pt-5 pb-10"
                            style={{ maxHeight: '92%' }}
                        >
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
                            <Text className="text-sm font-semibold text-neutral-600 mb-2 ml-1">
                                Title
                            </Text>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Give your entry a title..."
                                placeholderTextColor="#A3A3A3"
                                className="bg-neutral-50 rounded-2xl px-4 py-3.5 text-neutral-800 text-base font-semibold mb-5 border border-neutral-200"
                            />

                            {/* Content */}
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

                            {/* Delete */}
                            {isEditing && (
                                <TouchableOpacity
                                    onPress={handleDelete}
                                    className="mt-6 py-3.5 rounded-2xl items-center flex-row justify-center gap-2 bg-red-50 border border-red-100"
                                >
                                    <Feather name="trash-2" size={16} color="#EF4444" />
                                    <Text className="text-red-500 font-semibold">
                                        Delete Entry
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}