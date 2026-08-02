type LocalDataListener = (source?: string) => void;

const listeners = new Set<LocalDataListener>();

export const notifyLocalDataChanged = (source?: string) => {
    listeners.forEach((listener) => listener(source));
};

export const subscribeToLocalDataChanges = (listener: LocalDataListener) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

