'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DEFAULT_CHATBOT_SCENARIO, mergeScenario, type ChatbotScenario } from '@/lib/chatbot-scenario';

import { ScanModal } from './scan-modal';

type ScanModalContextValue = {
    open: (prefillDestination?: string) => void;
};

const ScanModalContext = createContext<ScanModalContextValue | null>(null);

export function ScanModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [prefillDestination, setPrefillDestination] = useState<string | undefined>(undefined);
    const [scenario, setScenario] = useState<ChatbotScenario>(DEFAULT_CHATBOT_SCENARIO);

    useEffect(() => {
        let cancelled = false;
        fetch('/api/chatbot-config')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!cancelled && data?.scenario) {
                    setScenario(mergeScenario(data.scenario));
                }
            })
            .catch(() => {
                // Keep the built-in default scenario if the config can't be loaded.
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const open = useCallback((destination?: string) => {
        setPrefillDestination(destination);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => setIsOpen(false), []);

    const value = useMemo(() => ({ open }), [open]);

    return (
        <ScanModalContext.Provider value={value}>
            {children}
            <ScanModal isOpen={isOpen} onClose={close} prefillDestination={prefillDestination} scenario={scenario} />
        </ScanModalContext.Provider>
    );
}

export function useScanModal() {
    const ctx = useContext(ScanModalContext);
    if (!ctx) {
        throw new Error('useScanModal must be used within a ScanModalProvider');
    }
    return ctx;
}
