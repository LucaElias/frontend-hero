import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SCENARIOS } from '../data/scenarios';
import { RefreshCw, ChevronLeft, GraduationCap, Clock } from 'lucide-react';

interface StudentProgress {
    session_id: string;
    student_name: string;
    completed_count: number;
    completed_ids: string[];
    last_updated: string;
}

export const TeacherDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [students, setStudents] = useState<StudentProgress[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Auto-refresh every 10s
        return () => clearInterval(interval);
    }, []);

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
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-all text-sm font-medium"
                >
                    <RefreshCw className={loading ? "animate-spin w-4 h-4" : "w-4 h-4"} />
                    Aktualisieren
                </button>
            </header>

            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="text-slate-500 text-sm font-medium mb-1">Schüler Gesamt</div>
                            <div className="text-3xl font-black text-slate-900">{students.length}</div>
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
                            <div className="text-slate-500 text-sm font-medium mb-1">Aktivität</div>
                            <div className="text-sm text-green-600 font-bold">Live Updates aktiviert</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Schüler</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fortschritt</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Zuletzt Aktiv</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                            Noch keine Schülerdaten vorhanden.
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student) => {
                                        const progressPercent = (student.completed_count / totalScenarios) * 100;
                                        return (
                                            <tr key={student.session_id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs">
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
                                                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                                                            {student.completed_count} / {totalScenarios}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {progressPercent === 100 ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-black uppercase tracking-wider">
                                                            Fertig
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-black uppercase tracking-wider">
                                                            In Arbeit
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(student.last_updated).toLocaleTimeString()}
                                                    </div>
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
        </div>
    );
};
