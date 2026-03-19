import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SCENARIOS } from '../data/scenarios';
import { RefreshCw, ChevronLeft, GraduationCap, Key, X, Eye, Code, Calendar } from 'lucide-react';

interface StudentProgress {
    session_id: string;
    student_name: string;
    class_name: string;
    completed_count: number;
    completed_ids: string[];
    solution_data?: any;
    last_updated: string;
}

export const TeacherDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [students, setStudents] = useState<StudentProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [resetPinStudent, setResetPinStudent] = useState<StudentProgress | null>(null);
    const [newPin, setNewPin] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    const [schemaError, setSchemaError] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);

    const handleResetPin = async () => {
        if (!resetPinStudent || !newPin.trim() || !supabase) return;
        setIsResetting(true);

        const cleanName = resetPinStudent.student_name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanPass = newPin.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanClass = (resetPinStudent.class_name || 'allgemein').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const newSessionId = `${cleanClass}-${cleanName}-${cleanPass}`;

        const { error } = await supabase
            .from('student_progress')
            .update({ session_id: newSessionId })
            .eq('session_id', resetPinStudent.session_id);

        if (error) {
            alert("Fehler beim Ändern des Passworts: " + error.message);
        } else {
            alert("Passwort erfolgreich geändert!");
            setResetPinStudent(null);
            setNewPin('');
            fetchData();
        }

        setIsResetting(false);
    };

    const fetchData = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('student_progress')
            .select('*')
            .order('last_updated', { ascending: false });

        if (error) {
            console.error("Fetch error:", error);
            // Check if error is missing column
            if (error.message.includes('solution_data')) {
                setSchemaError(true);
            }
        } else if (data) {
            setStudents(data);
            setSchemaError(false);
        }
        setLoading(false);
    };

    const [selectedClass, setSelectedClass] = useState<string>('Alle Klassen');

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Auto-refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const classes = ['Alle Klassen', ...Array.from(new Set(students.map(s => s.class_name || 'allgemein')))];
    const filteredStudents = selectedClass === 'Alle Klassen'
        ? students
        : students.filter(s => (s.class_name || 'allgemein') === selectedClass);

    const totalScenarios = SCENARIOS.length;

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <header className="h-16 bg-gray-900 text-white flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronLeft />
                    </button>
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-indigo-400" />
                        <h1 className="text-xl font-bold tracking-tight">Lehrer Dashboard</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {!supabase && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-red-500/20 text-red-200 border border-red-500/50 rounded-md text-[10px] font-bold" title="Die Supabase-Keys fehlen in den Umgebungsvariablen (Vercel). Fortschritt wird nicht gespeichert.">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            OFFLINE (KEINE KEYS)
                        </div>
                    )}
                    {supabase && !loading && !schemaError && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-green-500/20 text-green-300 border border-green-500/50 rounded-md text-[10px] font-bold">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            VERBUNDEN
                        </div>
                    )}
                    {schemaError && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-amber-500/20 text-amber-200 border border-amber-500/50 rounded-md text-[10px] font-bold animate-pulse" title="Die Spalte 'solution_data' fehlt in Supabase. Bitte SQL-Update ausführen!">
                            SCHEMA-FEHLER
                        </div>
                    )}
                    <button
                        onClick={fetchData}
                        disabled={loading || !supabase}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-all text-sm font-medium disabled:opacity-50"
                    >
                        <RefreshCw className={loading ? "animate-spin w-4 h-4" : "w-4 h-4"} />
                        Aktualisieren
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="text-slate-500 text-sm font-medium mb-1">Schüler Gesamt</div>
                            <div className="text-3xl font-black text-slate-900">{students.length} <span className="text-sm font-medium text-slate-400">({filteredStudents.length} gefiltert)</span></div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="text-slate-500 text-sm font-medium mb-1">Durchschnittlicher Fortschritt</div>
                            <div className="text-3xl font-black text-slate-900">
                                {students.length > 0
                                    ? Math.round((students.reduce((acc: number, s: StudentProgress) => acc + s.completed_count, 0) / (students.length * totalScenarios)) * 100)
                                    : 0}%
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="text-slate-500 text-sm font-medium mb-1">Klasse filtern</div>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {classes.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Klasse</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Schüler</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fortschritt</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Zuletzt Aktiv</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aktionen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            Keine Schüler in dieser Auswahl.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => {
                                        const progressPercent = (student.completed_count / totalScenarios) * 100;
                                        return (
                                            <tr key={student.session_id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[11px] font-bold">
                                                        {student.class_name || 'allgemein'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm">
                                                            {student.student_name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className="font-bold text-slate-700">{student.student_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[100px]">
                                                            <div
                                                                className="h-full bg-indigo-600 transition-all duration-1000"
                                                                style={{ width: `${progressPercent}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                                                            {student.completed_count} / {totalScenarios}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-500">
                                                    {new Date(student.last_updated).toLocaleTimeString()}
                                                </td>
                                                <td className="px-6 py-4 flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedStudent(student)}
                                                        className="text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                                                        title="Code einspeisen"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        Ansehen
                                                    </button>
                                                    <button
                                                        onClick={() => setResetPinStudent(student)}
                                                        className="text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                                                        title="Neues Passwort vergeben"
                                                    >
                                                        <Key className="w-3.5 h-3.5" />
                                                        PIN
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Password Reset Modal */}
            {resetPinStudent && (
                <div className="fixed inset-0 bg-slate-900/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Key className="w-5 h-5 text-indigo-600" />
                                Neues Passwort
                            </h3>
                            <button onClick={() => { setResetPinStudent(null); setNewPin(''); }} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Vergib ein neues Passwort (PIN) für <strong>{resetPinStudent.student_name}</strong>.
                        </p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleResetPin();
                        }}>
                            <input
                                autoFocus
                                type="text"
                                value={newPin}
                                onChange={e => setNewPin(e.target.value)}
                                placeholder="Neue PIN (z.B. 1234)..."
                                className="w-full px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors mb-4"
                                required
                                disabled={isResetting}
                            />
                            <button type="submit" disabled={isResetting} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl transition-all">
                                {isResetting ? 'Wird gespeichert...' : 'Passwort ändern'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-slate-900/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <header className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">
                                    {selectedStudent.student_name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{selectedStudent.student_name}</h3>
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                        <span className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-600 lowercase">{selectedStudent.class_name || 'allgemein'}</span>
                                        • zuletzt aktiv um {new Date(selectedStudent.last_updated).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                                <X className="w-6 h-6" />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/30">
                            {/* Tickets List */}
                            <div className="md:col-span-4 space-y-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Abgeschlossene Tickets</h4>
                                {selectedStudent.completed_ids && selectedStudent.completed_ids.length > 0 ? (
                                    selectedStudent.completed_ids.map(id => {
                                        const scenario = SCENARIOS.find(s => s.id === id);
                                        return (
                                            <div key={id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter bg-indigo-50 px-2 py-0.5 rounded">
                                                        {scenario?.difficulty || 'Ticket'}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400">ID: {id}</span>
                                                </div>
                                                <div className="font-bold text-slate-800 text-sm mb-3">
                                                    {scenario?.title || id}
                                                </div>

                                                {selectedStudent.solution_data?.[id] ? (
                                                    <div className="relative group">
                                                        <div className="text-[11px] font-mono bg-slate-900 text-indigo-300 p-3 rounded-lg overflow-x-auto max-h-[150px] leading-relaxed border-l-4 border-indigo-500">
                                                            <pre>{selectedStudent.solution_data[id]}</pre>
                                                        </div>
                                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Code className="w-4 h-4 text-indigo-400/50" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-[10px] text-slate-400 italic bg-slate-50 p-2 rounded border border-dashed border-slate-200 text-center">
                                                        Keine Code-Daten vorhanden
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-sm text-slate-400 font-medium italic">Noch keine Tickets bearbeitet.</p>
                                    </div>
                                )}
                            </div>

                            {/* Summary / Stats */}
                            <div className="md:col-span-8 space-y-6">
                                <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h4 className="text-white/70 text-sm font-bold mb-1">Qualität & Performance</h4>
                                        <div className="text-3xl font-black mb-4">Hervorragend</div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                                                <div className="text-white/60 text-[10px] font-bold uppercase">Abgeschlossen</div>
                                                <div className="text-xl font-bold">{selectedStudent.completed_count} / {totalScenarios}</div>
                                            </div>
                                            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                                                <div className="text-white/60 text-[10px] font-bold uppercase">Klasse</div>
                                                <div className="text-xl font-bold">{selectedStudent.class_name || 'Allgemein'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <GraduationCap className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 -rotate-12" />
                                </div>

                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                    <h4 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-indigo-600" />
                                        Letzte Aktivitäten
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                                            <div>
                                                <div className="text-sm font-bold text-slate-800">Datenbank-Synchronisierung erfolgreich</div>
                                                <div className="text-xs text-slate-400 font-medium">{new Date(selectedStudent.last_updated).toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
