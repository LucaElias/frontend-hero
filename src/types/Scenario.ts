export type Phase = 'briefing' | 'diagnosis' | 'workbench' | 'review' | 'completed';

export interface ScenarioBriefing {
    sender: string;
    role: string;
    subject: string;
    message: string;
    goals: string[];
}

export interface ScenarioDiagnosis {
    question: string;
    options: {
        id: string;
        text: string;
        isCorrect: boolean;
        feedback: string;
    }[];
}

export interface ScenarioSolution {
    initialHtml: string;
    initialCss: string;
    requiredSelectors: string[];
    // function body as string or similar if logic is complex, 
    // but for now we'll rely on a simpler check or metadata.
    // We can add a "validation" function in the store or helper, 
    // but keeping data pure JSON-serializable is better if we fetch it later.
    // For this MV, we might put validation logic in a separate helper 
    // or simple check. Let's start with just content.
    targetCssProperties?: Record<string, Record<string, string>>; // selector -> { property: value }
    explanation: string;
}

export interface Scenario {
    id: string;
    title: string;
    difficulty: 'Junior' | 'Mid' | 'Senior';
    briefing: ScenarioBriefing;
    diagnosis: ScenarioDiagnosis;
    solution: ScenarioSolution;
    hints: {
        title: string;
        text: string;
    }[];
}
