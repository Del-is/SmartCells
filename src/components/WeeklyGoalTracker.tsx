import React, { useState, useMemo } from 'react';
import { 
  Target, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Sparkles, 
  TrendingUp, 
  Calendar,
  X,
  Flame,
  Award
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  ReferenceLine 
} from 'recharts';
import { WeeklyGoals, StudySessionLog, ExamAttempt } from '../types';

interface WeeklyGoalTrackerProps {
  goals: WeeklyGoals;
  onUpdateGoals: (newGoals: WeeklyGoals) => void;
  studyLogs: StudySessionLog[];
  onAddStudyLog: (minutes: number, note?: string) => void;
  attempts: ExamAttempt[];
  playSound: (type: 'pop' | 'click' | 'success' | 'fail') => void;
}

export const WeeklyGoalTracker: React.FC<WeeklyGoalTrackerProps> = ({
  goals,
  onUpdateGoals,
  studyLogs,
  onAddStudyLog,
  attempts,
  playSound,
}) => {
  const [activeMetric, setActiveMetric] = useState<'hours' | 'exams'>('hours');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  // Edit Goal Form State
  const [tempTargetHours, setTempTargetHours] = useState(goals.targetHours);
  const [tempTargetExams, setTempTargetExams] = useState(goals.targetExams);

  // Quick Log State
  const [customMinutes, setCustomMinutes] = useState('30');
  const [logNote, setLogNote] = useState('');

  // Calculate the 7 days of the current week (Monday - Sunday)
  const weekDays = useMemo(() => {
    const today = new Date();
    // Monday is day 1, Sunday is day 7
    const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
    const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const days = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      const isToday = isoDate === today.toISOString().split('T')[0];

      days.push({
        date: isoDate,
        dayName: dayNames[i],
        shortLabel: `${dayNames[i]} ${d.getDate()}`,
        isToday,
      });
    }

    return days;
  }, []);

  // Aggregate daily metrics
  const chartData = useMemo(() => {
    return weekDays.map((day) => {
      // Aggregate study hours
      const dayLogs = studyLogs.filter((log) => log.date === day.date);
      const totalMinutes = dayLogs.reduce((acc, curr) => acc + curr.minutes, 0);
      const hours = Number((totalMinutes / 60).toFixed(1));

      // Aggregate completed exams
      const completedExams = attempts.filter((attempt) => {
        if (attempt.status !== 'completed' || !attempt.completedAt) return false;
        const attemptDate = new Date(attempt.completedAt).toISOString().split('T')[0];
        return attemptDate === day.date;
      }).length;

      return {
        date: day.date,
        day: day.dayName,
        shortLabel: day.shortLabel,
        isToday: day.isToday,
        hours,
        minutes: totalMinutes,
        exams: completedExams,
        displayValue: activeMetric === 'hours' ? hours : completedExams,
      };
    });
  }, [weekDays, studyLogs, attempts, activeMetric]);

  // Current Week Totals
  const totalWeeklyHours = useMemo(() => {
    return Number(chartData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1));
  }, [chartData]);

  const totalWeeklyExams = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.exams, 0);
  }, [chartData]);

  // Target values & percentages
  const currentTarget = activeMetric === 'hours' ? goals.targetHours : goals.targetExams;
  const currentTotal = activeMetric === 'hours' ? totalWeeklyHours : totalWeeklyExams;
  const progressPercent = Math.min(100, Math.round((currentTotal / (currentTarget || 1)) * 100));
  const isGoalAchieved = currentTotal >= currentTarget && currentTarget > 0;
  const dailyTargetPace = Number((currentTarget / 7).toFixed(1));

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    const targetHours = Math.max(1, Number(tempTargetHours) || 1);
    const targetExams = Math.max(1, Number(tempTargetExams) || 1);
    onUpdateGoals({ targetHours, targetExams });
    setShowGoalModal(false);
    playSound('success');
  };

  const handleQuickLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      onAddStudyLog(mins, logNote.trim() || 'Self-study session');
      setShowLogModal(false);
      setLogNote('');
      playSound('success');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xl relative overflow-hidden transition-all">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-br from-brand-500/8 via-accent-purple/5 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none blur-2xl" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <Target size={22} className="text-brand-500" />
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Weekly Goals & Progress
            </h3>
            {isGoalAchieved && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-bounce">
                <Sparkles size={13} />
                Goal Reached!
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm">
            Track your weekly study milestones and visualize consistency with daily progress bars.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Quick Study Log button */}
          <button
            id="open-log-study-btn"
            onClick={() => {
              setShowLogModal(true);
              playSound('click');
            }}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Log Study Time</span>
          </button>

          {/* Goal adjustment button */}
          <button
            id="open-edit-goals-btn"
            onClick={() => {
              setTempTargetHours(goals.targetHours);
              setTempTargetExams(goals.targetExams);
              setShowGoalModal(true);
              playSound('click');
            }}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200/60 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Edit3 size={15} />
            <span>Set Targets</span>
          </button>
        </div>
      </div>

      {/* Metric Selector & Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-6 relative z-10">
        {/* Toggle Pills */}
        <div className="lg:col-span-6 flex flex-col sm:flex-row gap-3">
          <div className="bg-slate-100/90 p-1 rounded-2xl flex border border-slate-200/80">
            <button
              id="metric-tab-hours"
              onClick={() => {
                setActiveMetric('hours');
                playSound('pop');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeMetric === 'hours'
                  ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock size={16} className={activeMetric === 'hours' ? 'text-brand-500' : ''} />
              <span>Study Hours</span>
            </button>
            <button
              id="metric-tab-exams"
              onClick={() => {
                setActiveMetric('exams');
                playSound('pop');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeMetric === 'exams'
                  ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CheckCircle2 size={16} className={activeMetric === 'exams' ? 'text-brand-500' : ''} />
              <span>Exams Completed</span>
            </button>
          </div>
        </div>

        {/* Progress KPI Card */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {activeMetric === 'hours' ? 'Weekly Hours Pacing' : 'Weekly Exam Pacing'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {currentTotal}
              </span>
              <span className="text-slate-400 font-semibold text-sm">
                / {currentTarget} {activeMetric === 'hours' ? 'hrs target' : 'exams target'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              isGoalAchieved 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-brand-50 text-brand-700'
            }`}>
              {progressPercent}% Achieved
            </span>
            {/* Progress bar line */}
            <div className="w-28 sm:w-36 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isGoalAchieved ? 'bg-emerald-500' : 'bg-brand-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="relative z-10 w-full pt-2">
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
            >
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={activeMetric === 'hours'}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                        <div className="font-bold text-slate-200 flex items-center justify-between gap-3">
                          <span>{data.shortLabel}</span>
                          {data.isToday && (
                            <span className="text-[10px] bg-brand-500/80 text-white px-1.5 py-0.2 rounded">
                              Today
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-black text-amber-300">
                          {activeMetric === 'hours'
                            ? `${data.hours} hrs (${data.minutes} mins)`
                            : `${data.exams} ${data.exams === 1 ? 'exam completed' : 'exams completed'}`
                          }
                        </div>
                        <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                          Daily pace target: ~{dailyTargetPace} {activeMetric === 'hours' ? 'hrs/day' : 'exams/day'}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Target pacing line */}
              <ReferenceLine 
                y={dailyTargetPace} 
                stroke="#f59e0b" 
                strokeDasharray="4 4" 
                strokeWidth={1.5}
                label={{ 
                  value: `Daily Pace: ${dailyTargetPace}`, 
                  position: 'right', 
                  fill: '#d97706', 
                  fontSize: 10,
                  fontWeight: 600 
                }} 
              />
              <Bar 
                dataKey="displayValue" 
                radius={[8, 8, 0, 0]}
                animationDuration={600}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      entry.isToday 
                        ? '#6366f1' // Today in brand purple/indigo
                        : entry.displayValue > 0 
                          ? '#3b82f6' // Active days in clean blue
                          : '#e2e8f0' // Empty days
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Tip Row */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#6366f1]" />
              <span className="font-semibold text-slate-700">Today</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#3b82f6]" />
              <span>Past Days</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-amber-500" />
              <span>Pace Goal ({dailyTargetPace}/day)</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar size={13} />
            <span>Current Week: Monday to Sunday</span>
          </div>
        </div>
      </div>

      {/* Goal Setting Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowGoalModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Target size={24} />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Weekly Target Goals</h4>
                <p className="text-xs text-slate-500">Define your custom study benchmarks for each week</p>
              </div>
            </div>

            <form onSubmit={handleSaveGoals} className="space-y-5">
              {/* Target Hours Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Target Study Hours per Week
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={tempTargetHours}
                    onChange={(e) => setTempTargetHours(parseFloat(e.target.value) || 1)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-lg focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                  />
                </div>
                {/* Presets */}
                <div className="flex gap-2 pt-1">
                  {[3, 5, 8, 10, 15].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTempTargetHours(preset)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        tempTargetHours === preset
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Exams Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Target Exam Completions per Week
                </label>
                <div className="relative">
                  <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="1"
                    value={tempTargetExams}
                    onChange={(e) => setTempTargetExams(parseInt(e.target.value, 10) || 1)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-lg focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                  />
                </div>
                {/* Presets */}
                <div className="flex gap-2 pt-1">
                  {[2, 3, 5, 7, 10].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTempTargetExams(preset)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        tempTargetExams === preset
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-goals-confirm-btn"
                  className="flex-1 py-3 px-4 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 shadow-md shadow-brand-500/20 transition-all cursor-pointer"
                >
                  Save Goals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Study Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowLogModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Log Study Session</h4>
                <p className="text-xs text-slate-500">Record study time spent offline or in textbooks</p>
              </div>
            </div>

            <form onSubmit={handleQuickLogSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Study Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="720"
                  step="5"
                  required
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-lg focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                />
                {/* Quick Add Buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[15, 30, 45, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setCustomMinutes(mins.toString())}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        customMinutes === mins.toString()
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Topic / Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Molecular Biology review, Calculus set"
                  value={logNote}
                  onChange={(e) => setLogNote(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-log-study-btn"
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  Log Minutes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
