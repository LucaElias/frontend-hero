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
    className: string | null;
    sessionId: string | null;
    solutions: Record<string, string>;
    lastSyncError: string | null;

    startScenario: (scenarioId: string) => void;
    setPhase: (phase: Phase) => void;
    updateUserCss: (css: string) => void;
    completeScenario: (scenarioId: string) => void;
    addMistake: () => void;
    resetMistakes: () => void;
    nextScenario: () => void;
    setHasSeenTutorial: (value: boolean) => void;
    fullReset: () => void;
    importProgress: (data: string) => boolean;
    loginStudent: (name: string, password: string, className: string) => Promise<{ success: boolean; message?: string }>;
    logoutStudent: () => void;
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
            className: null,
            sessionId: null,
            solutions: {},
            lastSyncError: null,

            startScenario: (scenarioId: string) => {
                const state = get();
                const scenario = SCENARIOS.find(s => s.id === scenarioId);
                if (!scenario) return;

                // Load saved solution if exists, otherwise initial CSS
                const savedCss = state.solutions[scenarioId];

                set({
                    currentScenarioId: scenarioId,
                    phase: 'briefing',
                    userCss: savedCss || scenario.solution.initialCss,
                    mistakes: 0
                });
            },

            setPhase: (phase: Phase) => set({ phase }),

            updateUserCss: (css: string) => set({ userCss: css }),

            completeScenario: (scenarioId: string) => {
                const { completedScenarios, solutions, userCss } = get();
                const isNew = !completedScenarios.includes(scenarioId);

                set({
                    completedScenarios: isNew ? [...completedScenarios, scenarioId] : completedScenarios,
                    solutions: { ...solutions, [scenarioId]: userCss },
                    phase: 'completed'
                });

                // Trigger sync
                get().syncProgress?.();
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
                const { completedScenarios } = get();
                const newCompleted = val
                    ? (completedScenarios.includes('0-tutorial') ? completedScenarios : [...completedScenarios, '0-tutorial'])
                    : completedScenarios.filter(id => id !== '0-tutorial');

                set({
                    hasSeenTutorial: val,
                    completedScenarios: newCompleted
                });
                get().syncProgress?.();
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
                    className: null,
                    sessionId: null,
                    solutions: {},
                    lastSyncError: null
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

            loginStudent: async (name: string, password: string, className: string) => {
                const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
                const cleanPass = password.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
                const cleanClass = className.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

                // Composite ID including class to isolate sessions
                const combinedId = `${cleanClass}-${cleanName}-${cleanPass}`;

                try {
                    if (supabase) {
                        // 1. Check if the EXACT session exists (Login)
                        const { data: existingSession, error: sessionError } = await supabase
                            .from('student_progress')
                            .select('*')
                            .eq('session_id', combinedId)
                            .single();

                        if (existingSession && !sessionError) {
                            set({
                                studentName: name,
                                className: className,
                                sessionId: combinedId,
                                completedScenarios: existingSession.completed_ids || [],
                                solutions: existingSession.solution_data || {},
                                hasSeenTutorial: (existingSession.completed_ids || []).includes('0-tutorial'),
                                phase: 'briefing'
                            });
                            return { success: true };
                        }

                        // 2. If session doesn't exist, check if the Name is already taken in this class
                        // using a DIFFERENT password (which would have a different session_id)
                        const { data: nameInClass, error: nameError } = await supabase
                            .from('student_progress')
                            .select('session_id')
                            .eq('class_name', className)
                            .eq('student_name', name)
                            .maybeSingle();

                        if (nameInClass && !nameError) {
                            // Name exists but session_id didn't match -> Wrong password or name taken
                            return {
                                success: false,
                                message: `Der Name "${name}" ist in der Klasse "${className}" bereits vergeben. Bitte wähle einen anderen Namen oder prüfe dein Passwort.`
                            };
                        }
                    }

                    // 3. Create fresh session
                    set({
                        studentName: name,
                        className: className,
                        sessionId: combinedId,
                        completedScenarios: [],
                        hasSeenTutorial: false,
                        phase: 'briefing'
                    });
                    await get().syncProgress?.();
                    return { success: true };
                } catch (err) {
                    console.error("Login error", err);
                    set({
                        studentName: name,
                        className: className,
                        sessionId: combinedId,
                        completedScenarios: [],
                        hasSeenTutorial: false,
                        phase: 'briefing'
                    });
                    await get().syncProgress?.();
                    return { success: true };
                }
            },

            logoutStudent: () => {
                set({
                    studentName: null,
                    className: null,
                    sessionId: null,
                    solutions: {},
                    completedScenarios: [],
                    hasSeenTutorial: false,
                    phase: 'briefing',
                    lastSyncError: null
                });
            },

            syncProgress: async () => {
                const state = get();
                if (!supabase || !state.studentName || !state.sessionId) return;

                try {
                    const { error } = await supabase.from('student_progress').upsert({
                        session_id: state.sessionId,
                        student_name: state.studentName,
                        class_name: state.className || 'allgemein',
                        completed_count: state.completedScenarios.length,
                        completed_ids: state.completedScenarios,
                        solution_data: state.solutions,
                        last_updated: new Date().toISOString()
                    }, { onConflict: 'session_id' });

                    if (error) {
                        console.error("Supabase Sync Error:", error.message, error.details);
                        set({ lastSyncError: error.message });
                    } else {
                        set({ lastSyncError: null });
                    }
                } catch (err: any) {
                    console.error("Sync failed critically:", err);
                    set({ lastSyncError: err.message || "Unbekannter Fehler beim Speichern" });
                }
            }
        }),
        {
            name: 'css-werkstatt-storage',
        }
    )
);
