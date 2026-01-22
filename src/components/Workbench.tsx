import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, HelpCircle, Zap } from 'lucide-react';
import { ShadowPreview } from './ShadowPreview';
import { useGameStore } from '../store/useGameStore';
import type { Scenario } from '../types/Scenario';
import clsx from 'clsx';

interface Props {
    scenario: Scenario;
}

export const Workbench: React.FC<Props> = ({ scenario }) => {
    const { userCss, updateUserCss, completeScenario, addMistake } = useGameStore();
    const [isValidating, setIsValidating] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [hintsRevealed, setHintsRevealed] = useState(0);
    const [showHelp, setShowHelp] = useState(false);

    // Reset state when scenario changes
    useEffect(() => {
        setHintsRevealed(0);
        setShowHelp(false);
        setFeedback(null);
    }, [scenario.id]);

    const handleReset = () => {
        updateUserCss(scenario.solution.initialCss);
        setFeedback(null);
    };

    const handleRevealHint = () => {
        if (hintsRevealed < (scenario.hints?.length || 0)) {
            setHintsRevealed(h => h + 1);
        }
    };

    const handleValidate = () => {
        setIsValidating(true);
        setFeedback(null);

        // Fake validation delay for effect
        setTimeout(() => {
            // Very basic validation: Check if required selectors are present and output changed
            const hasChanged = userCss.trim() !== scenario.solution.initialCss.trim();

            // This is a naive check. In a real app we'd parse the CSS AST.
            // For Scenario 1: check for background-color on .cta-button
            // For Scenario 2: check for padding on .info-box
            // For Scenario 3: check for display: flex on .gallery

            // We look at the scenario logic.
            let isCorrect = false;
            let hint = "";

            if (!hasChanged) {
                hint = "Du hast noch nichts geändert!";
            } else {
                // specific checks based on scenario ID
                if (scenario.id === '1-invisible-button') {
                    if (userCss.includes('background-color') && userCss.includes('.cta-button')) {
                        isCorrect = true;
                    } else {
                        hint = "Hast du dem .cta-button eine background-color gegeben?";
                    }
                } else if (scenario.id === '2-sticky-text') {
                    if (userCss.includes('padding') && userCss.includes('.info-box')) {
                        isCorrect = true;
                    } else {
                        hint = "Versuch es mal mit 'padding' auf der .info-box.";
                    }
                } else if (scenario.id === '3-broken-gallery') {
                    if (userCss.includes('display: flex') && userCss.includes('.gallery')) {
                        isCorrect = true;
                    } else {
                        hint = "Die Galerie (.gallery) braucht ein anderes Display-Verhalten.";
                    }
                }
            }

            if (isCorrect) {
                completeScenario(scenario.id);
            } else {
                addMistake();
                setFeedback(hint || "Das sieht noch nicht ganz richtig aus.");
            }

            setIsValidating(false);
        }, 800);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Toolbar */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="font-bold text-lg text-slate-800 tracking-tight">{scenario.title}</h2>
                    <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 rounded text-slate-500">Workspace</div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-all border",
                            showHelp
                                ? "bg-amber-50 text-amber-700 border-amber-200 shadow-inner"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        )}
                    >
                        <HelpCircle className="w-4 h-4" />
                        Hilfe & Tipps
                    </button>

                    <div className="h-6 w-px bg-slate-200 mx-2"></div>

                    <button
                        onClick={handleReset}
                        className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Code zurücksetzen"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleValidate}
                        disabled={isValidating}
                        style={!isValidating ? { backgroundColor: '#15803d', color: '#ffffff' } : {}}
                        className={clsx(
                            "flex items-center gap-2 px-6 py-2.5 rounded-md font-bold transition-all shadow-md active:translate-y-0.5",
                            isValidating
                                ? "bg-gray-500 text-white cursor-wait shadow-none"
                                : "hover:opacity-90 hover:shadow-lg"
                        )}
                    >
                        {isValidating ? (
                            'Prüfe...'
                        ) : (
                            <>
                                <Play className="w-4 h-4 fill-current" /> EINGABE PRÜFEN
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Hints Panel */}
            {showHelp && (
                <div className="bg-amber-50/50 border-b border-amber-200 px-6 py-4 animate-in slide-in-from-top-2 backdrop-blur-sm">
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-amber-900 font-bold flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4" /> Mentor-Hinweise
                        </h3>
                        <div className="grid gap-3">
                            {scenario.hints?.slice(0, hintsRevealed).map((hint, i) => (
                                <div key={i} className="bg-white border border-amber-100 p-3 rounded-lg shadow-sm flex gap-3 animate-in fade-in">
                                    <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold self-start whitespace-nowrap">
                                        {hint.title}
                                    </div>
                                    <p className="text-gray-700 text-sm">{hint.text}</p>
                                </div>
                            ))}

                            {hintsRevealed < (scenario.hints?.length || 0) && (
                                <button
                                    onClick={handleRevealHint}
                                    className="bg-white border border-dashed border-amber-300 text-amber-600 p-3 rounded-lg text-sm font-medium hover:bg-amber-100 hover:border-amber-400 transition-colors text-left"
                                >
                                    {hintsRevealed === 0 ? "Ersten Hinweis anzeigen" : "Nächsten Hinweis anzeigen"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Split View */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                {/* Editor Pane */}
                <div className="h-1/2 lg:h-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
                    <div className="flex-1 relative min-h-0">
                        <Editor
                            height="100%"
                            defaultLanguage="css"
                            language="css"
                            value={userCss || scenario.solution.initialCss} // Fallback
                            onChange={(value) => updateUserCss(value || '')}
                            theme="vs-light"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 20 }
                            }}
                        />

                        {feedback && (
                            <div className="absolute bottom-4 left-4 right-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded shadow-lg animate-in fade-in slide-in-from-bottom-2 z-10">
                                <strong>Hinweis:</strong> {feedback}
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview Pane */}
                <div className="h-1/2 lg:h-full lg:w-1/2 bg-gray-50 p-4 lg:p-6 flex flex-col min-h-0">
                    <div className="flex-1 relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                        <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-1.5 shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400/50"></div>
                            <div className="ml-2 text-xs text-gray-400 font-mono">Vorschau</div>
                        </div>
                        <div className="relative flex-1 w-full h-full overflow-hidden">
                            <ShadowPreview html={scenario.solution.initialHtml} css={userCss} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
