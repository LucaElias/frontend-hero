import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Phase } from '../types/Scenario';
import { SCENARIOS } from '../data/scenarios';

interface GameState {
    currentScenarioId: string | null;
    phase: Phase;
    userCss: string;
    completedScenarios: string[];
    mistakes: number;
    hasSeenTutorial: boolean;
    studentName: string | null;
    sessionId: string | null;

    startScenario: (scenarioId: string) => void;
    setPhase: (phase: Phase) => void;
    updateUserCss: (css: string) => void;
    completeScenario: (scenarioId: string) => void;
    addMistake: () => void;
    resetMistakes: () => void;
    nextScenario: () => void;
    setHasSeenTutorial: (val: boolean) => void;
    fullReset: () => void;
    importProgress: (data: string) => boolean;
    setStudentName: (name: string) => void;
    syncProgress: () => Promise<void>;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            currentScenarioId: null,
            phase: 'briefing',
            userCss: '',
            completedScenarios: [],
            mistakes: 0,
            hasSeenTutorial: false,
            studentName: null,
            sessionId: null,

            startScenario: (scenarioId: string) => {
                const scenario = SCENARIOS.find(s => s.id === scenarioId);
                if (!scenario) return;

                set({
                    currentScenarioId: scenarioId,
                    phase: 'briefing',
                    userCss: scenario.solution.initialCss,
                    mistakes: 0
                });
            },

            setPhase: (phase: Phase) => set({ phase }),

            updateUserCss: (css: string) => set({ userCss: css }),

            completeScenario: (scenarioId: string) => {
                const { completedScenarios } = get();
                if (!completedScenarios.includes(scenarioId)) {
                    set({
                        completedScenarios: [...completedScenarios, scenarioId],
                        phase: 'completed'
                    });
                    // Trigger sync
                    get().syncProgress?.();
                }
            },

            addMistake: () => set(state => ({ mistakes: state.mistakes + 1 })),

            resetMistakes: () => set({ mistakes: 0 }),

            nextScenario: () => {
                const state = get();
                const currentIndex = SCENARIOS.findIndex(s => s.id === state.currentScenarioId);
                const nextScenario = SCENARIOS[currentIndex + 1];

                if (nextScenario) {
                    state.startScenario(nextScenario.id);
                }
            },

            setHasSeenTutorial: (val: boolean) => {
                set({ hasSeenTutorial: val });
            },

            fullReset: () => {
                set({
                    currentScenarioId: null,
                    phase: 'briefing',
                    userCss: '',
                    completedScenarios: [],
                    mistakes: 0,
                    hasSeenTutorial: false,
                    studentName: null,
                    sessionId: null
                });
            },

            importProgress: (jsonData: string) => {
                try {
                    const data = JSON.parse(jsonData);
                    if (Array.isArray(data.completedScenarios)) {
                        set({
                            completedScenarios: data.completedScenarios,
                            hasSeenTutorial: data.hasSeenTutorial ?? true,
                            studentName: data.studentName || get().studentName,
                            sessionId: data.sessionId || get().sessionId
                        });
                        return true;
                    }
                    return false;
                } catch (e) {
                    return false;
                }
            },

            setStudentName: (name: string) => {
                const sessionId = Math.random().toString(36).substring(7);
                set({ studentName: name, sessionId });
            },

            syncProgress: async () => {
                const state = get();
                if (!supabase || !state.studentName || !state.sessionId) return;

                try {
                    await supabase.from('student_progress').upsert({
                        session_id: state.sessionId,
                        student_name: state.studentName,
                        completed_count: state.completedScenarios.length,
                        completed_ids: state.completedScenarios,
                        last_updated: new Date().toISOString()
                    }, { onConflict: 'session_id' });
                } catch (err) {
                    console.error("Sync failed", err);
                }
            }
        }),
        {
            name: 'css-werkstatt-storage',
        }
    )
);
