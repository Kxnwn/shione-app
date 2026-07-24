import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef, useEffect } from "react";

const { width } = Dimensions.get("window");

// route names that exist as screens but should NOT appear as tabs
const HIDDEN_TABS = ["profile"];

function CustomTabBar({ state, descriptors, navigation }: any) {
    const insets = useSafeAreaInsets();
    const animValues = useRef(
        state.routes.map(() => new Animated.Value(0))
    ).current;

    useEffect(() => {
        animValues.forEach((anim: Animated.Value, index: number) => {
            Animated.spring(anim, {
                toValue: state.index === index ? 1 : 0,
                friction: 8,
                tension: 100,
                useNativeDriver: true,
            }).start();
        });
    }, [state.index]);

    // filter out hidden routes directly by name — doesn't depend on
    // expo-router transforming `href: null` into descriptor options,
    // which isn't guaranteed when a custom tabBar is supplied
    const visibleRoutes = state.routes.filter(
        (route: any) => !HIDDEN_TABS.includes(route.name)
    );

    return (
        <View
            style={[
                styles.container,
                { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 },
            ]}
        >
            <View style={styles.tabBar}>
                <View style={styles.innerContainer}>
                    {visibleRoutes.map((route: any) => {
                        // real index in the full route list — needed so
                        // isFocused/animValues stay correctly aligned
                        const index = state.routes.indexOf(route);
                        const { options } = descriptors[route.key];
                        const label = options.title ?? route.name;
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            });
                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        const iconName = (() => {
                            switch (route.name) {
                                case "index": return isFocused ? "home" : "home-outline";
                                case "chat": return isFocused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline";
                                case "journal": return isFocused ? "book" : "book-outline";
                                case "profile": return isFocused ? "person" : "person-outline";
                                default: return "ellipse-outline";
                            }
                        })();

                        const scale = animValues[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.1],
                        });

                        return (
                            <TouchableOpacity
                                key={route.key}
                                onPress={onPress}
                                style={styles.tabItem}
                                activeOpacity={0.7}
                            >
                                <Animated.View
                                    style={[
                                        styles.iconContainer,
                                        isFocused && styles.activeIconContainer,
                                        { transform: [{ scale }] },
                                    ]}
                                >
                                    <Ionicons
                                        name={iconName as any}
                                        size={24}
                                        color={isFocused ? "#8854C0" : "#9CA3AF"}
                                    />
                                </Animated.View>

                                <Animated.Text
                                    style={[
                                        styles.label,
                                        {
                                            color: isFocused ? "#8854C0" : "#9CA3AF",
                                            opacity: animValues[index].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.7, 1],
                                            }),
                                        },
                                    ]}
                                >
                                    {label}
                                </Animated.Text>

                                {isFocused && (
                                    <View style={styles.activeDot} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="chat" options={{ title: "Chat" }} />
            <Tabs.Screen name="journal" options={{ title: "Journal" }} />
            <Tabs.Screen name="profile" options={{ title: "Profile", href: null }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    tabBar: {
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 28,
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        borderWidth: 1,
        borderColor: "rgba(136, 84, 192, 0.12)",
        shadowColor: "#8854C0",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    innerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 8,
        paddingTop: 10,
        paddingBottom: 8,
        minWidth: width * 0.85,
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 4,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    activeIconContainer: {
        backgroundColor: "rgba(136, 84, 192, 0.1)",
    },
    label: {
        fontSize: 11,
        fontWeight: "600",
        marginTop: 2,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#8854C0",
        marginTop: 4,
    },
});