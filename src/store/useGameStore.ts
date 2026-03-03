import { create } from 'zustand';
import type { Phase } from '../types/Scenario';
import { SCENARIOS } from '../data/scenarios';

interface GameState {
    currentScenarioId: string | null;
    phase: Phase;
    userCss: string;
    completedScenarios: string[];
    mistakes: number;
    hasSeenTutorial: boolean;

    startScenario: (scenarioId: string) => void;
    setPhase: (phase: Phase) => void;
    updateUserCss: (css: string) => void;
    completeScenario: (scenarioId: string) => void;
    addMistake: () => void;
    resetMistakes: () => void;
    nextScenario: () => void;
    setHasSeenTutorial: (val: boolean) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
    currentScenarioId: null,
    phase: 'briefing',
    userCss: '',
    completedScenarios: [],
    mistakes: 0,
    hasSeenTutorial: localStorage.getItem('hasSeenTutorial') === 'true',

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
        set(state => ({
            completedScenarios: [...new Set([...state.completedScenarios, scenarioId])],
            phase: 'completed'
        }));
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
        localStorage.setItem('hasSeenTutorial', val ? 'true' : 'false');
        set({ hasSeenTutorial: val });
    }
}));
