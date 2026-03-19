import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SCENARIOS } from '../data/scenarios';
import { RefreshCw, ChevronLeft, GraduationCap, Key, X } from 'lucide-react';

interface StudentProgress {
    session_id: string;
    student_name: string;
    class_name: string;
    completed_count: number;
    completed_ids: string[];
    last_updated: string;
}

export const TeacherDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [students, setStudents] = useState<StudentProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [resetPinStudent, setResetPinStudent] = useState<StudentProgress | null>(null);
    const [newPin, setNewPin] = useState('');
    const [isResetting, setIsResetting] = useState(false);

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
        const { data } = await supabase
            .from('student_progress')
            .select('*')
            .order('last_updated', { ascending: false });

        if (data) setStudents(data);
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
                    {supabase && !loading && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-green-500/20 text-green-300 border border-green-500/50 rounded-md text-[10px] font-bold">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            VERBUNDEN
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
                                                <td className="px-6 py-4 flex justify-end">
                                                    <button
                                                        onClick={() => setResetPinStudent(student)}
                                                        className="text-[11px] font-bold bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                                                        title="Neues Passwort vergeben"
                                                    >
                                                        <Key className="w-3.5 h-3.5" />
                                                        PIN ändern
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
        </div>
    );
};
