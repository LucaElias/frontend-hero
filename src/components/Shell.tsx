import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { SCENARIOS } from '../data/scenarios';
import { CheckCircle, Terminal, Menu, X, Mail, Search, Code2, Settings, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { ScenarioBriefing } from './ScenarioBriefing';
import { DiagnosticTool } from './DiagnosticTool';
import { Workbench } from './Workbench';
import { SuccessView } from './SuccessView';
import { TourGuide } from './TourGuide';
import { ScenarioBuilder } from './ScenarioBuilder';
import { PlusCircle, Upload, Shield } from 'lucide-react';
import type { Scenario } from '../types/Scenario';
import { TeacherDashboard } from './TeacherDashboard';

export const Shell: React.FC = () => {
    const {
        currentScenarioId,
        phase,
        completedScenarios,
        studentName,
        loginStudent,
        startScenario,
        setPhase,
        addMistake,
        fullReset
    } = useGameStore();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [tempName, setTempName] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const currentScenario = SCENARIOS.find(s => s.id === currentScenarioId);

    // Initial State: No scenario selected? Or auto-select first?
    // Let's auto-select first if none.
    React.useEffect(() => {
        if (!currentScenarioId && SCENARIOS.length > 0 && studentName) {
            const nextScenario = SCENARIOS.find(s => !completedScenarios.includes(s.id)) || SCENARIOS[0];
            startScenario(nextScenario.id);
        }
    }, [currentScenarioId, studentName, completedScenarios, startScenario]);

    return (
        <div className="flex h-screen bg-gray-100 text-gray-900 font-sans overflow-hidden">
            <TourGuide />
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 z-50 flex items-center px-4 justify-between border-b border-gray-800">
                <div className="flex items-center gap-2 text-white font-bold tracking-tight">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    Frontend Hero
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-gray-300 hover:text-white"
                >
                    <Menu />
                </button>
            </div>

            {/* Sidebar */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-gray-300 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-full lg:z-auto pt-16 lg:pt-0",
                isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
            )}>
                <div className="hidden lg:flex p-4 border-b border-gray-800 items-center gap-2 text-white font-bold tracking-tight">
                    <Terminal className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                    Frontend Hero
                </div>
                {/* Mobile Sidebar Header with Close Button */}
                <div className="flex lg:hidden p-4 border-b border-gray-800 items-center justify-between text-white font-bold tracking-tight">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-indigo-400" />
                        Frontend Hero
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 text-xs font-semibold tracking-wider text-gray-500 mb-2" id="tour-tickets-header">
                        Tickets
                    </div>
                    {SCENARIOS.map((scenario) => {
                        const isActive = currentScenarioId === scenario.id;
                        const isCompleted = completedScenarios.includes(scenario.id);

                        return (
                            <button
                                key={scenario.id}
                                id={scenario.id === SCENARIOS[0].id ? 'tour-tickets-list' : undefined}
                                aria-current={isActive ? 'true' : undefined}
                                aria-label={`${scenario.title}, Schwierigkeit ${scenario.difficulty}${isCompleted ? ', abgeschlossen' : ''}`}
                                onClick={() => {
                                    startScenario(scenario.id);
                                    setIsSidebarOpen(false);
                                }}
                                className={clsx(
                                    "w-full text-left px-4 !py-5 flex items-center gap-3 transition-all border-l-4 border-b-2 border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500",
                                    isActive
                                        ? "bg-indigo-700/50 border-white shadow-md font-bold text-white font-bold"
                                        : "hover:bg-gray-800 hover:text-white border-transparent text-slate-300"
                                )}
                            >
                                <div className={clsx(
                                    "w-2 h-2 rounded-full shrink-0",
                                    isCompleted ? "bg-green-500" :
                                        isActive ? "bg-amber-400 animate-pulse" : "bg-gray-600"
                                )} aria-hidden="true" />
                                <div className="flex-1 truncate">
                                    <div className="font-medium truncate flex items-center gap-2">
                                        {scenario.title}
                                    </div>
                                    <div className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                                        {scenario.difficulty}
                                        {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-green-500 inline ml-1" aria-hidden="true" />}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-800 text-xs text-gray-500 flex flex-col gap-3">
                    <div className="flex gap-2">
                        <div
                            role="button"
                            onClick={() => {
                                setPhase('builder');
                                setIsSidebarOpen(false);
                            }}
                            className="flex items-center justify-center gap-2 flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-all font-bold shadow-md active:scale-95 cursor-pointer border border-indigo-400/30"
                            title="Neues Ticket erstellen"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Erstellen
                        </div>
                        <label className="flex items-center justify-center gap-2 flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-all font-bold shadow-md cursor-pointer active:scale-95 border border-indigo-400/30" title="Ticket als JSON importieren">
                            <Upload className="w-4 h-4" />
                            Import
                            <input
                                type="file"
                                className="hidden"
                                accept=".json"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        try {
                                            const scenario = JSON.parse(event.target?.result as string) as Scenario;
                                            if (!SCENARIOS.find(s => s.id === scenario.id)) {
                                                SCENARIOS.push(scenario);
                                            }
                                            startScenario(scenario.id);
                                            setIsSidebarOpen(false);
                                        } catch (err) {
                                            alert("Fehler beim Importieren des Tickets.");
                                        }
                                    };
                                    reader.readAsText(file);
                                }}
                            />
                        </label>
                    </div>
                    <div className="pt-2 border-t border-gray-800/50 flex flex-col gap-2">
                        <div className="text-[10px] uppercase tracking-widest font-bold text-gray-600 mb-1 flex items-center gap-1">
                            <Settings className="w-3 h-3" />
                            Fortschritt
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {studentName && (
                                <button
                                    onClick={() => {
                                        if (confirm("Möchtest du wirklich deinen gesamten Fortschritt löschen? Dies betrifft auch die Cloud-Speicherung.")) {
                                            fullReset();
                                            window.location.reload();
                                        }
                                    }}
                                    className="flex items-center gap-2 text-left hover:text-red-400 transition-colors py-1 group"
                                    title="Alle erledigten Aufgaben zurücksetzen"
                                >
                                    <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" />
                                    Zurücksetzen
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    const teacherPin = import.meta.env.VITE_TEACHER_PIN || 'admin';
                                    const pin = prompt(`Bitte Lehrer-PIN eingeben (Standard: ${teacherPin === 'admin' ? 'admin' : '****'}):`);
                                    if (pin === teacherPin) {
                                        setPhase('teacher');
                                    } else if (pin) {
                                        alert("Falscher PIN.");
                                    }
                                }}
                                className="flex items-center gap-2 text-left hover:text-indigo-400 transition-colors py-1"
                                title="Lehrer-Dashboard öffnen"
                            >
                                <Shield className="w-3.5 h-3.5" />
                                Lehrer-Ansicht
                            </button>
                        </div>
                    </div>
                    <div className="text-center opacity-50 mt-2">Simulierte Umgebung v1.0</div>
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
                        <div className="h-full w-full bg-white flex flex-col">
                            {/* Navigation Tabs */}
                            <div className="flex items-center border-b border-gray-200 bg-gray-50 px-6 pt-4 gap-2 shrink-0 overflow-x-auto no-scrollbar">
                                {Phases.map(p => (
                                    <button
                                        key={p.id}
                                        id={p.id === 'briefing' ? 'tour-briefing-tab' : p.id === 'diagnosis' ? 'tour-diagnosis-tab' : 'tour-workbench-tab'}
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

                            <div className="flex-1 overflow-hidden relative bg-white">
                                <div key={phase} className="h-full w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
                                    {renderPhase(phase, currentScenario, setPhase, addMistake)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Name Entry Modal */}
            {!studentName && (
                <div className="fixed inset-0 bg-gray-900/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                                <Terminal className="w-10 h-10" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Willkommen bei Frontend Hero!</h2>
                        <p className="text-gray-600 text-center mb-8">Gib deinen Namen und ein Passwort ein, um deinen Fortschritt in der Cloud zu speichern oder fortzusetzen.</p>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            if (tempName.trim() && tempPassword.trim()) {
                                setIsLoggingIn(true);
                                await loginStudent(tempName.trim(), tempPassword.trim());
                                setIsLoggingIn(false);

                                const store = useGameStore.getState();
                                const nextScenario = SCENARIOS.find(s => !store.completedScenarios.includes(s.id)) || SCENARIOS[0];
                                store.startScenario(nextScenario.id);
                            }
                        }}>
                            <input
                                autoFocus
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                placeholder="Dein Name..."
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none transition-colors mb-3 text-lg"
                                required
                                disabled={isLoggingIn}
                            />
                            <input
                                type="password"
                                value={tempPassword}
                                onChange={(e) => setTempPassword(e.target.value)}
                                placeholder="Passwort / PIN (z.B. 1234)"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none transition-colors mb-4 text-lg"
                                required
                                disabled={isLoggingIn}
                            />
                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-75 disabled:active:scale-100"
                            >
                                {isLoggingIn ? 'Lädt...' : 'Jetzt starten / Login'}
                            </button>
                        </form>
                        <p className="text-center text-xs text-gray-400 mt-6">
                            Dein Name wird für das Teacher-Dashboard gespeichert.
                        </p>
                    </div>
                </div>
            )}
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
    if (phase === 'builder') {
        return <ScenarioBuilder />;
    }
    if (phase === 'teacher') {
        return <TeacherDashboard onBack={() => setPhase('briefing')} />;
    }
    return null;
}

const Phases = [
    { id: 'briefing', label: 'Posteingang', icon: Mail },
    { id: 'diagnosis', label: 'Analyse', icon: Search },
    { id: 'workbench', label: 'Workspace', icon: Code2 },
] as const;

