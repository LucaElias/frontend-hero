import React from 'react';
import { Mail, User, Eye } from 'lucide-react';
import type { Scenario } from '../types/Scenario';
import { ShadowPreview } from './ShadowPreview';

interface Props {
    scenario: Scenario;
    onStart: () => void;
}

export const ScenarioBriefing: React.FC<Props> = ({ scenario, onStart }) => {
    const { briefing } = scenario;

    return (
        <div className="w-full bg-white flex flex-col p-4 lg:p-8">
            <div className="w-full bg-white shadow-sm rounded-xl border border-gray-200 flex flex-col pb-12 mb-8">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-5 h-5" />
                        <span className="font-semibold">Posteingang</span>
                    </div>
                    <span className="text-xs font-mono text-gray-400">ticket-id: #{scenario.id.split('-')[0].toUpperCase()}92</span>
                </div>

                <div className="p-8">
                    {/* Email Header */}
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{briefing.subject}</h2>
                            <div className="text-sm text-gray-500 mt-1">
                                Von: <span className="font-medium text-gray-700">{briefing.sender}</span>
                                <span className="mx-2">•</span>
                                An: <span className="font-medium text-gray-700">{briefing.role}</span>
                            </div>
                        </div>
                    </div>

                    {/* Message Body */}
                    <div className="prose prose-lg max-w-none text-gray-700 mb-8 whitespace-pre-wrap font-sans">
                        {briefing.message}
                    </div>

                    {/* PROBLEM PREVIEW */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden mb-8">
                        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2 text-slate-600 text-sm font-bold">
                            <Eye className="w-4 h-4" />
                            Aktueller Stand (Fehlerhaft)
                        </div>
                        <div className="h-64 relative bg-white">
                            <ShadowPreview html={scenario.solution.initialHtml} css={scenario.solution.initialCss} />
                            {/* Overlay to prevent interaction if needed, or just let them click it */}
                            <div className="absolute inset-0 pointer-events-none border-4 border-transparent hover:border-red-500/20 transition-colors" />
                        </div>
                    </div>

                    <button
                        id="tour-briefing-start-button"
                        onClick={onStart}
                        style={{ backgroundColor: '#000000', color: '#ffffff' }}
                        className="w-full max-w-lg mx-auto font-bold text-lg py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] mt-8 mb-2 border-b-2 border-gray-900"
                    >
                        Problemanalyse starten
                    </button>
                </div>
            </div>
        </div>
    );
};
