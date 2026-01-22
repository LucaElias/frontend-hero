import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { SCENARIOS } from '../data/scenarios';
import { CheckCircle, Terminal, Menu, X, Mail, Search, Code2 } from 'lucide-react';
import clsx from 'clsx';
import { ScenarioBriefing } from './ScenarioBriefing';
import { DiagnosticTool } from './DiagnosticTool';
import { Workbench } from './Workbench';
import { SuccessView } from './SuccessView';

export const Shell: React.FC = () => {
    const {
        currentScenarioId,
        phase,
        completedScenarios,
        startScenario,
        setPhase,
        addMistake
    } = useGameStore();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const currentScenario = SCENARIOS.find(s => s.id === currentScenarioId);

    // Initial State: No scenario selected? Or auto-select first?
    // Let's auto-select first if none.
    React.useEffect(() => {
        if (!currentScenarioId && SCENARIOS.length > 0) {
            startScenario(SCENARIOS[0].id);
        }
    }, [currentScenarioId, startScenario]);

    return (
        <div className="flex h-screen bg-gray-100 text-gray-900 font-sans overflow-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 z-50 flex items-center px-4 justify-between border-b border-gray-800">
                <div className="flex items-center gap-2 text-white font-bold tracking-tight">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    CSS Werkstatt
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-gray-300 hover:text-white"
                >
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-gray-300 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-full lg:z-auto pt-16 lg:pt-0",
                isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
            )}>
                <div className="hidden lg:flex p-4 border-b border-gray-800 items-center gap-2 text-white font-bold tracking-tight">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    CSS Werkstatt
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        Tickets
                    </div>
                    {SCENARIOS.map(scenario => {
                        const isActive = currentScenarioId === scenario.id;
                        const isCompleted = completedScenarios.includes(scenario.id);

                        return (
                            <button
                                key={scenario.id}
                                onClick={() => {
                                    startScenario(scenario.id);
                                    setIsSidebarOpen(false);
                                }}
                                style={{
                                    backgroundColor: isActive ? '#4338ca' : 'transparent',
                                    color: isActive ? '#ffffff' : '#cbd5e1'
                                }}
                                className={clsx(
                                    "w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-l-4",
                                    isActive
                                        ? "border-white shadow-md font-bold"
                                        : "hover:bg-gray-800 hover:text-white border-transparent",
                                    !isActive && !isCompleted && "opacity-90"
                                )}
                            >
                                <div className={clsx(
                                    "w-2 h-2 rounded-full",
                                    isCompleted ? "bg-green-500" :
                                        isActive ? "bg-amber-400 animate-pulse" : "bg-gray-600"
                                )} />
                                <div className="flex-1 truncate">
                                    <div className="font-medium truncate">{scenario.title}</div>
                                    <div className="text-xs opacity-60 flex items-center gap-1">
                                        {scenario.difficulty}
                                        {isCompleted && <CheckCircle className="w-3 h-3 text-green-500 inline ml-1" />}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
                    Simulierte Umgebung v1.0
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative pt-16 lg:pt-0">
                {/* Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {!currentScenario ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Lade Szenarien...
                        </div>
                    ) : (
                        <div className="h-full w-full mx-auto bg-white flex flex-col">
                            {/* Navigation Tabs */}
                            <div className="flex items-center border-b border-gray-200 bg-gray-50 px-6 pt-4 gap-2 shrink-0">
                                {Phases.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setPhase(p.id)}
                                        className={clsx(
                                            "flex items-center gap-2 px-4 py-3 rounded-t-lg text-sm font-bold transition-all border-t border-x relative -mb-px",
                                            phase === p.id
                                                ? "bg-white border-gray-200 text-indigo-700 z-10"
                                                : "bg-gray-100 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                                        )}
                                    >
                                        <p.icon className="w-4 h-4" />
                                        {p.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-hidden relative">
                                {renderPhase(phase, currentScenario, setPhase, addMistake)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper to keep the main return clean
const renderPhase = (phase: string, currentScenario: any, setPhase: any, addMistake: any) => {
    if (phase === 'briefing') {
        return <ScenarioBriefing scenario={currentScenario} onStart={() => setPhase('diagnosis')} />;
    }
    if (phase === 'diagnosis') {
        return <DiagnosticTool scenario={currentScenario} onComplete={() => setPhase('workbench')} onMistake={() => addMistake()} />;
    }
    if (phase === 'workbench') {
        return <Workbench scenario={currentScenario} />;
    }
    if (phase === 'completed') {
        return <SuccessView />;
    }
    return null;
}

const Phases = [
    { id: 'briefing', label: 'Posteingang', icon: Mail },
    { id: 'diagnosis', label: 'Analyse', icon: Search },
    { id: 'workbench', label: 'Workspace', icon: Code2 },
] as const;

