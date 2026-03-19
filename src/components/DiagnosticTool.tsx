import React, { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle, Eye } from 'lucide-react';
import type { Scenario } from '../types/Scenario';
import { ShadowPreview } from './ShadowPreview';
import clsx from 'clsx';

interface Props {
    scenario: Scenario;
    onComplete: () => void;
    onMistake: () => void;
}

export const DiagnosticTool: React.FC<Props> = ({ scenario, onComplete, onMistake }) => {
    const { diagnosis } = scenario;
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hintsRevealed, setHintsRevealed] = useState(0);
    const [showHelp, setShowHelp] = useState(false);

    // Reset hints when scenario changes
    React.useEffect(() => {
        setHintsRevealed(0);
        setShowHelp(false);
    }, [scenario.id]);

    const handleSubmit = (optionId: string) => {
        setSelectedId(optionId);
        setIsSubmitted(true);

        const option = diagnosis.options.find(o => o.id === optionId);
        // Soft decoding for isCorrect if needed, but for now we'll keep the logic simple
        if (option?.isCorrect) {
            setTimeout(() => {
                onComplete();
            }, 1500);
        } else {
            onMistake();
        }
    };

    return (
        <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden bg-slate-50">
            {/* Visual Context (Left/Top) */}
            <div className="lg:w-1/2 p-4 lg:p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center justify-between text-gray-500 font-medium text-sm">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Visuelle Analyse
                        </div>
                        <button
                            onClick={() => setShowHelp(!showHelp)}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-xs transition-all border",
                                showHelp
                                    ? "bg-amber-50 text-amber-700 border-amber-200 shadow-inner"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            <HelpCircle className="w-3.5 h-3.5" />
                            Hilfe & Tipps
                        </button>
                    </div>
                    <div className="relative flex-1 w-full h-full bg-white">
                        <ShadowPreview html={scenario.solution.initialHtml} css={scenario.solution.initialCss} />
                    </div>
                </div>
            </div>

            {/* Hints Panel (Right/Top before Diagnosis Questions) */}
            <div className="lg:w-1/2 flex flex-col overflow-hidden bg-white">
                {showHelp && (
                    <div className="bg-amber-50/50 border-b border-amber-200 px-4 lg:px-8 py-4 animate-in slide-in-from-top-2 backdrop-blur-sm shrink-0">
                        <div className="max-w-xl mx-auto">
                            <h3 className="text-amber-900 font-bold flex items-center gap-2 mb-3 text-sm">
                                <HelpCircle className="w-4 h-4" /> Mentor-Hinweise zur Analyse
                            </h3>
                            <div className="grid gap-3">
                                {scenario.hints?.slice(0, hintsRevealed).map((hint, i) => (
                                    <div key={i} className="bg-white border border-amber-100 p-3 rounded-lg shadow-sm flex flex-col gap-2 animate-in fade-in">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold self-start whitespace-nowrap">
                                                Stufe {hint.level || i + 1}
                                            </div>
                                            <div className="font-semibold text-sm text-gray-800">{hint.title}</div>
                                        </div>
                                        <p className="text-gray-700 text-sm mt-1">{hint.text}</p>
                                    </div>
                                ))}

                                {hintsRevealed < (scenario.hints?.length || 0) && (
                                    <button
                                        onClick={() => setHintsRevealed(h => h + 1)}
                                        className="bg-white border border-dashed border-amber-300 text-amber-600 p-3 rounded-lg text-sm font-medium hover:bg-amber-100 hover:border-amber-400 transition-colors text-left"
                                    >
                                        Tipp Stufe {hintsRevealed + 1} freischalten
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Diagnosis Questions */}
                <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <div className="max-w-xl mx-auto">
                        <div className="flex items-center gap-3 mb-6 text-indigo-700">
                            <HelpCircle className="w-8 h-8" />
                            <h2 className="text-2xl font-bold">Was ist das Problem?</h2>
                        </div>

                        <p className="text-lg text-gray-800 font-medium mb-8 leading-relaxed">
                            {diagnosis.question}
                        </p>

                        <div className="space-y-4 mb-8" role="radiogroup" aria-labelledby="diagnosis-question">
                            {diagnosis.options.map((option) => {
                                const isSelected = selectedId === option.id;
                                const showFeedback = isSubmitted && isSelected;

                                return (
                                    <div key={option.id} className="relative">
                                        <button
                                            role="radio"
                                            aria-checked={isSelected}
                                            disabled={isSubmitted && option.isCorrect}
                                            onClick={() => !isSubmitted && handleSubmit(option.id)}
                                            className={clsx(
                                                "w-full text-left p-5 rounded-xl border-2 transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none",
                                                !isSubmitted && "hover:border-indigo-400 hover:bg-indigo-50 border-gray-100 shadow-sm bg-gray-50/50",
                                                isSubmitted && isSelected && option.isCorrect && "border-green-600 bg-green-50 ring-2 ring-green-600 ring-offset-2",
                                                isSubmitted && isSelected && !option.isCorrect && "border-red-500 bg-red-50",
                                                isSubmitted && !isSelected && "opacity-50 border-gray-100"
                                            )}
                                        >
                                            <span className={clsx(
                                                "font-semibold text-base",
                                                isSubmitted && isSelected && option.isCorrect ? "text-green-900" :
                                                    isSubmitted && isSelected && !option.isCorrect ? "text-red-900" :
                                                        "text-gray-700"
                                            )}>
                                                {option.text}
                                            </span>
                                        </button>

                                        {showFeedback && (
                                            <div
                                                role="alert"
                                                className={clsx(
                                                    "mt-2 p-3 rounded text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1",
                                                    option.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                )}>
                                                {option.isCorrect ? <CheckCircle className="w-4 h-4" aria-hidden="true" /> : <XCircle className="w-4 h-4" aria-hidden="true" />}
                                                {option.feedback}
                                                {!option.isCorrect && (
                                                    <button
                                                        onClick={() => setIsSubmitted(false)}
                                                        className="ml-auto text-xs underline font-bold focus:ring-1 focus:ring-red-400"
                                                    >
                                                        Nochmal versuchen
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};
