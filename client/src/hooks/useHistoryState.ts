import { useState, useCallback } from "react";

export default function useHistoryState<T>(initialState: T) {
    const [state, _setState] = useState(initialState);
    const [history, setHistory] = useState([initialState]);
    const [pointer, setPointer] = useState(0);

    const setState = useCallback(
        (newState: T) => {
            const newHistory = [...history.slice(0, pointer + 1), newState];
            setHistory(newHistory);
            setPointer(newHistory.length - 1);
            _setState(newState);
        },
        [pointer, history]
    );

    const undo: () => void = useCallback(() => {
        if (pointer <= 0) return;
        setPointer((p) => p - 1);
        _setState(history[pointer - 1]);
    }, [history, pointer]);

    const redo: () => void = useCallback(() => {
        if (pointer >= history.length - 1) return;
        setPointer((p) => p + 1);
        _setState(history[pointer + 1]);
    }, [history, pointer]);

    return { state, setState, undo, redo };
}