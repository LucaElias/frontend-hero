import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { Scenario } from '../types/Scenario';
import { Code, X, Link as LinkIcon, Download } from 'lucide-react';
import clsx from 'clsx';
import Editor from '@monaco-editor/react';

export const ScenarioBuilder: React.FC = () => {
    const { setPhase } = useGameStore();

    // Initial Form State
    const [formData, setFormData] = useState<Scenario>({
        id: `custom-${Date.now()}`,
        title: '',
        difficulty: 'Junior',
        briefing: { sender: '', role: '', subject: '', message: '', goals: [] },
        diagnosis: {
            question: '',
            options: [
                { id: 'opt1', text: '', isCorrect: true, feedback: '' },
                { id: 'opt2', text: '', isCorrect: false, feedback: '' },
                { id: 'opt3', text: '', isCorrect: false, feedback: '' }
            ]
        },
        solution: { initialHtml: '<div class="box">\n  Hello World\n</div>', initialCss: '.box {\n  \n}', requiredSelectors: [], explanation: '' },
        hints: [{ level: 1, title: 'Tipp 1', text: '' }]
    });

    const handleExportJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `ticket-${formData.id}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleExportLink = () => {
        const base64 = btoa(encodeURIComponent(JSON.stringify(formData)));
        const url = `${window.location.origin}${window.location.pathname}?ticket=${base64}`;
        navigator.clipboard.writeText(url);
        alert('Link in die Zwischenablage kopiert!');
    };

    return (
        <div className="w-full h-full bg-slate-50 overflow-y-auto p-4 lg:p-8">
            <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 min-h-full">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10 rounded-t-xl">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Code className="text-indigo-600" />
                        Ticket Builder
                    </h1>
                    <div className="flex items-center gap-3">
                        <button onClick={handleExportJson} className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md text-sm font-medium transition-colors border border-indigo-200">
                            <Download className="w-4 h-4" /> Als JSON laden
                        </button>
                        <button onClick={handleExportLink} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors">
                            <LinkIcon className="w-4 h-4" /> Link kopieren
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <button onClick={() => setPhase('briefing')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-10">
                    {/* 1. Basics */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">1. Allgemeine Infos</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Ticket Titel</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="z.B. Der unsichtbare Button"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Schwierigkeit</label>
                                <select
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                    value={formData.difficulty}
                                    onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
                                >
                                    <option>Junior</option>
                                    <option>Mid</option>
                                    <option>Senior</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* 2. Briefing (Email) */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">2. Die E-Mail (Briefing)</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Absender Name</label>
                                <input type="text" className="w-full p-2 border border-slate-300 rounded" value={formData.briefing.sender} onChange={e => setFormData({ ...formData, briefing: { ...formData.briefing, sender: e.target.value } })} placeholder="z.B. Lisa aus dem Design" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Deine Rolle</label>
                                <input type="text" className="w-full p-2 border border-slate-300 rounded" value={formData.briefing.role} onChange={e => setFormData({ ...formData, briefing: { ...formData.briefing, role: e.target.value } })} placeholder="z.B. Frontend Entwickler" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Betreff</label>
                            <input type="text" className="w-full p-2 border border-slate-300 rounded" value={formData.briefing.subject} onChange={e => setFormData({ ...formData, briefing: { ...formData.briefing, subject: e.target.value } })} placeholder="WICHTIG: Button kaputt!" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nachrichtentext</label>
                            <textarea className="w-full p-2 border border-slate-300 rounded h-32" value={formData.briefing.message} onChange={e => setFormData({ ...formData, briefing: { ...formData.briefing, message: e.target.value } })} placeholder="Hallo, wir haben ein Problem..."></textarea>
                        </div>
                    </section>

                    {/* 3. Diagnose */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">3. Fehleranalyse (Multiple Choice)</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Welche Frage soll gestellt werden?</label>
                            <input type="text" className="w-full p-2 border border-slate-300 rounded" value={formData.diagnosis.question} onChange={e => setFormData({ ...formData, diagnosis: { ...formData.diagnosis, question: e.target.value } })} placeholder="Warum ist der Button nicht zu sehen?" />
                        </div>
                        <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div className="text-sm font-semibold text-slate-600 mb-2">Antwortmöglichkeiten (Die 1. ist immer "korrekt" markiert, Reihenfolge wird in App gemischt falls impl.)</div>
                            {formData.diagnosis.options.map((opt, i) => (
                                <div key={opt.id} className="flex gap-4">
                                    <div className="flex-1">
                                        <input type="text" className="w-full p-2 border border-slate-300 rounded text-sm mb-1" value={opt.text} onChange={e => {
                                            const newOps = [...formData.diagnosis.options];
                                            newOps[i].text = e.target.value;
                                            setFormData({ ...formData, diagnosis: { ...formData.diagnosis, options: newOps } });
                                        }} placeholder={`Antwort ${i + 1}`} />
                                        <input type="text" className="w-full p-2 border border-slate-300 rounded text-xs text-slate-500" value={opt.feedback} onChange={e => {
                                            const newOps = [...formData.diagnosis.options];
                                            newOps[i].feedback = e.target.value;
                                            setFormData({ ...formData, diagnosis: { ...formData.diagnosis, options: newOps } });
                                        }} placeholder={`Feedback wenn User dies wählt...`} />
                                    </div>
                                    <div className="pt-2">
                                        <span className={clsx("px-2 py-1 text-xs font-bold rounded", opt.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                                            {opt.isCorrect ? "Richtig" : "Falsch"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 4. Code / Lösung */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">4. Code & Workspace</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Defektes HTML</label>
                                <div className="h-48 border border-slate-300 rounded overflow-hidden">
                                    <Editor
                                        height="100%"
                                        defaultLanguage="html"
                                        language="html"
                                        value={formData.solution.initialHtml}
                                        onChange={(value) => setFormData({ ...formData, solution: { ...formData.solution, initialHtml: value || '' } })}
                                        options={{ minimap: { enabled: false }, lineNumbers: 'off' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Defektes CSS</label>
                                <div className="h-48 border border-slate-300 rounded overflow-hidden">
                                    <Editor
                                        height="100%"
                                        defaultLanguage="css"
                                        language="css"
                                        value={formData.solution.initialCss}
                                        onChange={(value) => setFormData({ ...formData, solution: { ...formData.solution, initialCss: value || '' } })}
                                        options={{ minimap: { enabled: false }, lineNumbers: 'off' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Erklärung nach Lösung</label>
                            <textarea className="w-full p-2 border border-slate-300 rounded h-24" value={formData.solution.explanation} onChange={e => setFormData({ ...formData, solution: { ...formData.solution, explanation: e.target.value } })} placeholder="Gut gemacht! Mit background-color hast du..."></textarea>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
