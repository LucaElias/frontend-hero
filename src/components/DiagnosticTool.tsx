import React, { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle, Eye, Lightbulb } from 'lucide-react';
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
    const [showHint, setShowHint] = useState(false);

    const handleSubmit = (optionId: string) => {
        setSelectedId(optionId);
        setIsSubmitted(true);

        const option = diagnosis.options.find(o => o.id === optionId);
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
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center gap-2 text-gray-500 font-medium text-sm">
                        <Eye className="w-4 h-4" />
                        Visuelle Analyse
                    </div>
                    <div className="relative flex-1 w-full h-full bg-white">
                        <ShadowPreview html={scenario.solution.initialHtml} css={scenario.solution.initialCss} />
                    </div>
                </div>
            </div>

            {/* Diagnosis Questions (Right/Bottom) */}
            <div className="lg:w-1/2 p-4 lg:p-8 overflow-y-auto bg-white">
                <div className="max-w-xl mx-auto">
                    <div className="flex items-center gap-3 mb-6 text-indigo-700">
                        <HelpCircle className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">Was ist das Problem?</h2>
                    </div>

                    <p className="text-lg text-gray-800 font-medium mb-8 leading-relaxed">
                        {diagnosis.question}
                    </p>

                    <div className="space-y-4 mb-8">
                        {diagnosis.options.map((option) => {
                            const isSelected = selectedId === option.id;
                            const showFeedback = isSubmitted && isSelected;

                            return (
                                <div key={option.id} className="relative">
                                    <button
                                        disabled={isSubmitted && option.isCorrect}
                                        onClick={() => !isSubmitted && handleSubmit(option.id)}
                                        className={clsx(
                                            "w-full text-left p-5 rounded-xl border-2 transition-all",
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
                                        <div className={clsx(
                                            "mt-2 p-3 rounded text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1",
                                            option.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        )}>
                                            {option.isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                            {option.feedback}
                                            {!option.isCorrect && (
                                                <button
                                                    onClick={() => setIsSubmitted(false)}
                                                    className="ml-auto text-xs underline font-bold"
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

                    {/* Hint Section for Analysis */}
                    <div className="pt-6 border-t border-gray-100">
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
                        >
                            <Lightbulb className="w-4 h-4" />
                            {showHint ? "Hinweis ausblenden" : "Ich brauche einen Tipp"}
                        </button>

                        {showHint && (
                            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4 animate-in fade-in">
                                <p className="text-sm text-amber-900 font-medium mb-1">KI-Tipp zur Analyse:</p>
                                <p className="text-sm text-gray-700 italic">
                                    "{scenario.hints[0]?.text || "Schau dir das Bild genau an."}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
