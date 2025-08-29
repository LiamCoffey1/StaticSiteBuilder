import { useEffect } from 'react';

const useKeyboardShortcuts = (shortcuts: { [key: string]: () => void }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const keyCombo = `${event.ctrlKey ? 'Ctrl+' : ''}${event.shiftKey ? 'Shift+' : ''}${event.key}`;
            if (shortcuts[keyCombo]) {
                event.preventDefault();
                shortcuts[keyCombo]();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};

export default useKeyboardShortcuts;