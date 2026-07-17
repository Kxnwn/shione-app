import { BlurView } from "expo-blur";
import { ViewStyle, StyleProp } from "react-native";

type GlassCardProps = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

export default function GlassCard({
    children,
    style,
}: GlassCardProps) {
    return (
        <BlurView
            intensity={35}
            tint="light"
            style={[
                {
                    overflow: "hidden",
                    borderRadius: 28,

                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.25)",

                    backgroundColor: "rgba(255,255,255,0.12)",

                    shadowColor: "#8854C0",
                    shadowOpacity: 0.15,
                    shadowRadius: 24,
                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    elevation: 8,
                },
                style,
            ]}
        >
            {children}
        </BlurView>
    );
}