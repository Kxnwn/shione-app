
import { useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";

import {
    startUsageSession,
    heartbeatUsageSession,
    endUsageSession,
} from "@/services/usage.service";

export function useUsageTracker() {
    useEffect(() => {
        let sessionId: number | null = null;
        let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
        let currentState: AppStateStatus = AppState.currentState;
        let disposed = false;
        let transitionId = 0;

        function stopHeartbeat() {
            if (heartbeatTimer !== null) {
                clearInterval(heartbeatTimer);
                heartbeatTimer = null;
            }
        }

        async function endSession() {
            stopHeartbeat();

            const id = sessionId;
            sessionId = null;

            if (id !== null) {
                try {
                    await endUsageSession(id);
                } catch (error) {
                    console.warn("Could not end usage session:", error);
                }
            }
        }

        async function startSession() {
            if (sessionId !== null || disposed) return;

            const thisTransition = ++transitionId;

            try {
                const session = await startUsageSession();
                const id = session?.id;

                if (
                    typeof id !== "number" ||
                    !Number.isSafeInteger(id) ||
                    id <= 0
                ) {
                    throw new Error("The API did not return a valid session ID.");
                }

                if (
                    disposed ||
                    thisTransition !== transitionId ||
                    currentState !== "active"
                ) {
                    try {
                        await endUsageSession(id);
                    } catch (error) {
                         console.warn(
        "Could not start usage session:",
        error instanceof Error ? error.message : error
    );

    if (error && typeof error === "object" && "response" in error) {
        console.warn(
            "Usage API response:",
            (error as any).response?.status,
            (error as any).response?.data
        );
    }
                    }
                    return;
                }

                sessionId = id;

                heartbeatTimer = setInterval(async () => {
                    const activeSessionId = sessionId;

                    if (
                        activeSessionId === null ||
                        currentState !== "active"
                    ) {
                        return;
                    }

                    try {
                        await heartbeatUsageSession(activeSessionId);
                    } catch (error) {
                        console.warn("Usage heartbeat failed:", error);
                    }
                }, 30_000);
            } catch (error) {
                console.warn("Could not start usage session:", error);
            }
        }

        if (currentState === "active") {
            void startSession();
        }

        const subscription = AppState.addEventListener(
            "change",
            (nextState) => {
                const wasActive = currentState === "active";
                currentState = nextState;

                if (wasActive && nextState !== "active") {
                    transitionId++;
                    void endSession();
                } else if (!wasActive && nextState === "active") {
                    void startSession();
                }
            }
        );

        return () => {
            disposed = true;
            transitionId++;
            subscription.remove();
            void endSession();
        };
    }, []);
}
