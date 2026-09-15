/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Plus, 
  Brain, 
  History, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Loader2,
  Trophy,
  GraduationCap,
  Target,
  Clock,
  LayoutDashboard,
  Settings,
  Search,
  Lightbulb,
  User,
  Save,
  LogIn,
  LogOut,
  Pencil,
  Atom,
  Globe,
  Calculator as CalcIcon,
  Book,
  Mail,
  Lock,
  Github,
  Chrome,
  MessageSquare,
  Send,
  Wrench,
  Ruler,
  Timer,
  FlaskConical,
  Languages,
  Hash,
  Thermometer,
  Scale,
  Sparkles,
  RefreshCw,
  Download,
  FileText,
  Zap,
  ArrowUp,
  Bell,
  BellRing
} from 'lucide-react';
import { cn } from './lib/utils';
import { Question, Exam, ExamAttempt, UserProfile, StudyMaterial, ChatMessage, UserSettings, WeeklyGoals, StudySessionLog } from './types';
import { generateExamQuestions, getExamFeedback, generateStudyMaterial, generateQuickStudySummary, askStudyQuestion, askGeneralQuestion, getDictionaryDefinition } from './services/gemini';
import ReactMarkdown from 'react-markdown';
import { WeeklyGoalTracker } from './components/WeeklyGoalTracker';
import { exportExamReportPDF } from './utils/pdfExport';
import { PeriodicTableTool } from './components/PeriodicTableTool';
import { DictionaryTool } from './components/DictionaryTool';

type View = 'auth' | 'name-prompt' | 'dashboard' | 'create' | 'exam' | 'results' | 'history' | 'profile' | 'study' | 'study-session' | 'companion' | 'settings' | 'tools';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('local_current_user'));
  const [currentUser, setCurrentUser] = useState<string | null>(() => localStorage.getItem('local_current_user'));
  const [view, setView] = useState<View>(() => {
    const user = localStorage.getItem('local_current_user');
    if (!user) return 'auth';
    const prompted = localStorage.getItem(`name_prompted_${user}`);
    if (!prompted) return 'name-prompt';
    return 'dashboard';
  });
  const [knowledgeSeekerName, setKnowledgeSeekerName] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Scholar',
    preferredDifficulty: 'Medium',
    frequentSubjects: [],
    grade: ''
  });
  const [userSettings, setUserSettings] = useState<UserSettings>({
    soundEnabled: true,
    aiResponseStyle: 'detailed',
    defaultQuestionCount: 5,
    theme: 'light',
    uiTheme: 'standard',
    examReminderEnabled: false
  });
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttempt | null>(null);
  const [currentStudy, setCurrentStudy] = useState<StudyMaterial | null>(null);
  const [studyChat, setStudyChat] = useState<ChatMessage[]>([]);
  const [generalChat, setGeneralChat] = useState<ChatMessage[]>([]);
  const [companionDraft, setCompanionDraft] = useState('');
  const [chatAutoSaveStatus, setChatAutoSaveStatus] = useState<'saved' | 'saving' | 'synced'>('saved');
  const [lastChatAutoSavedTime, setLastChatAutoSavedTime] = useState<string | null>(null);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoals>({
    targetHours: 5,
    targetExams: 3
  });
  const [studyLogs, setStudyLogs] = useState<StudySessionLog[]>([]);
  const [onboardingStep, setOnboardingStep] = useState<'username' | 'target'>('username');
  const [onboardingTargetHours, setOnboardingTargetHours] = useState<number>(5);
  const [onboardingTargetExams, setOnboardingTargetExams] = useState<number>(3);
  const [chatLoading, setChatLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Generating with AI...');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load Data from LocalStorage
  useEffect(() => {
    if (currentUser) {
      const savedExams = localStorage.getItem(`exams_${currentUser}`);
      const savedAttempts = localStorage.getItem(`attempts_${currentUser}`);
      const savedProfile = localStorage.getItem(`profile_${currentUser}`);
      const savedStudy = localStorage.getItem(`study_${currentUser}`);
      const savedGeneralChat = localStorage.getItem(`generalChat_${currentUser}`);
      const savedDraft = localStorage.getItem(`generalChat_draft_${currentUser}`);
      const savedSettings = localStorage.getItem(`settings_${currentUser}`);
      const savedGoals = localStorage.getItem(`weeklyGoals_${currentUser}`);
      const savedStudyLogs = localStorage.getItem(`studyLogs_${currentUser}`);
      
      if (savedExams) setExams(JSON.parse(savedExams));
      if (savedAttempts) setAttempts(JSON.parse(savedAttempts));
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setUserProfile(parsed);
        setKnowledgeSeekerName(parsed.name && parsed.name !== 'Scholar' ? parsed.name : '');
      }
      if (savedStudy) setStudyMaterials(JSON.parse(savedStudy));
      if (savedGeneralChat) {
        setGeneralChat(JSON.parse(savedGeneralChat));
        setLastChatAutoSavedTime('previously');
      }
      if (savedDraft) setCompanionDraft(savedDraft);
      else setCompanionDraft('');
      if (savedSettings) setUserSettings(JSON.parse(savedSettings));
      if (savedGoals) {
        try {
          setWeeklyGoals(JSON.parse(savedGoals));
        } catch (e) {
          console.error(e);
        }
      }
      if (savedStudyLogs) {
        try {
          setStudyLogs(JSON.parse(savedStudyLogs));
        } catch (e) {
          console.error(e);
        }
      } else {
        // Seed friendly initial activity for current week so chart displays nicely
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);

        const initialLogs: StudySessionLog[] = [
          {
            id: 'sample-1',
            date: twoDaysAgo.toISOString().split('T')[0],
            minutes: 45,
            note: 'Mathematics review & problem sets',
            timestamp: twoDaysAgo.getTime()
          },
          {
            id: 'sample-2',
            date: yesterday.toISOString().split('T')[0],
            minutes: 60,
            note: 'Cell biology & genetics study',
            timestamp: yesterday.getTime()
          }
        ];
        setStudyLogs(initialLogs);
        localStorage.setItem(`studyLogs_${currentUser}`, JSON.stringify(initialLogs));
      }
    }
  }, [currentUser]);

  const handleUpdateWeeklyGoals = (newGoals: WeeklyGoals) => {
    setWeeklyGoals(newGoals);
    if (currentUser) {
      localStorage.setItem(`weeklyGoals_${currentUser}`, JSON.stringify(newGoals));
    }
  };

  const handleAddStudyLog = (minutes: number, note?: string) => {
    const todayIso = new Date().toISOString().split('T')[0];
    const newLog: StudySessionLog = {
      id: crypto.randomUUID(),
      date: todayIso,
      minutes,
      note: note || 'Study session',
      timestamp: Date.now(),
    };
    const updatedLogs = [newLog, ...studyLogs];
    setStudyLogs(updatedLogs);
    if (currentUser) {
      localStorage.setItem(`studyLogs_${currentUser}`, JSON.stringify(updatedLogs));
    }
  };

  // Auto-save: Periodically sync general AI Companion chat to localStorage in background without manual triggers
  useEffect(() => {
    if (!currentUser) return;

    const periodicSync = () => {
      try {
        if (generalChat.length > 0) {
          const stored = localStorage.getItem(`generalChat_${currentUser}`);
          const currentJson = JSON.stringify(generalChat);
          if (stored !== currentJson) {
            setChatAutoSaveStatus('saving');
            localStorage.setItem(`generalChat_${currentUser}`, currentJson);
            setTimeout(() => {
              setChatAutoSaveStatus('saved');
              setLastChatAutoSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            }, 300);
          } else if (!lastChatAutoSavedTime) {
            setLastChatAutoSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            setChatAutoSaveStatus('saved');
          }
        }
      } catch (err) {
        console.error("Auto-save periodic sync error:", err);
      }
    };

    // Auto-save interval checks and syncs every 3.5 seconds
    const intervalId = setInterval(periodicSync, 3500);

    // Save on beforeunload / window hide
    const handleBeforeUnload = () => {
      if (generalChat.length > 0) {
        localStorage.setItem(`generalChat_${currentUser}`, JSON.stringify(generalChat));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentUser, generalChat, lastChatAutoSavedTime]);

  // Reactive auto-sync when chat state updates
  useEffect(() => {
    if (!currentUser || generalChat.length === 0) return;
    setChatAutoSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(`generalChat_${currentUser}`, JSON.stringify(generalChat));
        setChatAutoSaveStatus('saved');
        setLastChatAutoSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.error("Chat reactive auto-save error:", err);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [generalChat, currentUser]);

  // Auto-save draft input periodically as user types
  useEffect(() => {
    if (!currentUser) return;
    const timer = setTimeout(() => {
      if (companionDraft.trim()) {
        localStorage.setItem(`generalChat_draft_${currentUser}`, companionDraft);
      } else {
        localStorage.removeItem(`generalChat_draft_${currentUser}`);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [companionDraft, currentUser]);

  const [inAppAlert, setInAppAlert] = useState<{
    type: 'warning' | 'success';
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  const getWeeklyExamProgress = () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
    const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const completedThisWeek = attempts.filter((attempt) => {
      if (attempt.status !== 'completed' || !attempt.completedAt) return false;
      return attempt.completedAt >= monday.getTime();
    }).length;

    const targetExams = Math.max(1, weeklyGoals?.targetExams || 3);
    const isBehindTarget = completedThisWeek < targetExams;
    const remaining = Math.max(0, targetExams - completedThisWeek);

    return {
      completedThisWeek,
      targetExams,
      isBehindTarget,
      remaining,
      monday
    };
  };

  const triggerPracticeExamAlert = (isManualTest: boolean = false) => {
    const progress = getWeeklyExamProgress();

    if (progress.isBehindTarget) {
      const alertMsg = `⚠️ SmartCells Practice Exam Reminder:\n\nYou haven't completed your practice exams for this week!\n\n• Weekly Target Frequency: ${progress.targetExams} exam${progress.targetExams === 1 ? '' : 's'}\n• Completed this week: ${progress.completedThisWeek}\n• Remaining: ${progress.remaining} exam${progress.remaining === 1 ? '' : 's'}\n\nTake a quick practice exam now to stay on schedule!`;
      
      try {
        window.alert(alertMsg);
      } catch (err) {
        console.warn('Browser alert blocked by iframe sandbox policy:', err);
      }

      setInAppAlert({
        type: 'warning',
        title: 'Weekly Practice Exam Reminder',
        message: `You haven't completed your practice exam target for this week (${progress.completedThisWeek}/${progress.targetExams} exams completed, ${progress.remaining} remaining). Ready for a quick practice exam?`,
        actionLabel: 'Take Practice Exam',
        onAction: () => {
          setInAppAlert(null);
          setView('create');
        }
      });
      playSound('pop');
    } else {
      const successMsg = `🎉 Great job! You have already met your weekly frequency target of ${progress.targetExams} practice exams (${progress.completedThisWeek} completed this week). You're on track!`;
      
      if (isManualTest) {
        try {
          window.alert(successMsg);
        } catch (err) {
          console.warn('Browser alert blocked by iframe sandbox policy:', err);
        }
        setInAppAlert({
          type: 'success',
          title: 'Weekly Target Met!',
          message: `You have completed ${progress.completedThisWeek} of ${progress.targetExams} target exams this week. All caught up!`,
          actionLabel: 'View Dashboard',
          onAction: () => {
            setInAppAlert(null);
            setView('dashboard');
          }
        });
        playSound('success');
      }
    }
  };

  // Check weekly target reminder when enabled and user visits the dashboard
  useEffect(() => {
    if (!currentUser || !userSettings.examReminderEnabled) return;

    // Check once per calendar day per session
    const todayStr = new Date().toISOString().split('T')[0];
    const sessionKey = `weekly_exam_reminder_notified_${currentUser}_${todayStr}`;
    const alreadyAlerted = sessionStorage.getItem(sessionKey);

    if (!alreadyAlerted && view === 'dashboard') {
      const progress = getWeeklyExamProgress();
      if (progress.isBehindTarget) {
        sessionStorage.setItem(sessionKey, 'true');
        const timer = setTimeout(() => {
          triggerPracticeExamAlert(false);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [currentUser, userSettings.examReminderEnabled, view, attempts, weeklyGoals]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem('local_users') || '{}');

      if (authMode === 'signup') {
        if (users[email]) {
          setAuthError('User already exists');
          setLoading(false);
          return;
        }
        const defaultProfile: UserProfile = { name: '', preferredDifficulty: 'Medium', frequentSubjects: [], grade: '' };
        users[email] = { password, profile: defaultProfile };
        localStorage.setItem('local_users', JSON.stringify(users));
        
        // Auto-login upon account creation and prompt for name
        setCurrentUser(email);
        setIsLoggedIn(true);
        localStorage.setItem('local_current_user', email);
        setUserProfile(defaultProfile);
        setKnowledgeSeekerName('');
        setExams([]);
        setAttempts([]);
        setStudyMaterials([]);
        setGeneralChat([]);
        setUserSettings({
          soundEnabled: true,
          aiResponseStyle: 'detailed',
          defaultQuestionCount: 5,
          theme: 'light',
          uiTheme: 'standard'
        });

        setView('name-prompt');
        playSound('success');
      } else {
        const user = users[email];
        if (!user || user.password !== password) {
          setAuthError('Invalid email or password');
          setLoading(false);
          return;
        }
        
        setCurrentUser(email);
        setIsLoggedIn(true);
        localStorage.setItem('local_current_user', email);
        
        // Load user data
        const savedExams = localStorage.getItem(`exams_${email}`);
        const savedAttempts = localStorage.getItem(`attempts_${email}`);
        const savedProfile = localStorage.getItem(`profile_${email}`);
        const savedStudy = localStorage.getItem(`study_${email}`);
        const savedGeneralChat = localStorage.getItem(`generalChat_${email}`);
        const savedSettings = localStorage.getItem(`settings_${email}`);
        
        if (savedExams) setExams(JSON.parse(savedExams));
        else setExams([]);
        
        if (savedAttempts) setAttempts(JSON.parse(savedAttempts));
        else setAttempts([]);
        
        let loadedProfile: UserProfile;
        if (savedProfile) loadedProfile = JSON.parse(savedProfile);
        else loadedProfile = user.profile || { name: 'Scholar', preferredDifficulty: 'Medium', frequentSubjects: [], grade: '' };
        setUserProfile(loadedProfile);
        setKnowledgeSeekerName(loadedProfile.name && loadedProfile.name !== 'Scholar' ? loadedProfile.name : '');

        if (savedStudy) setStudyMaterials(JSON.parse(savedStudy));
        else setStudyMaterials([]);

        if (savedGeneralChat) setGeneralChat(JSON.parse(savedGeneralChat));
        else setGeneralChat([]);

        if (savedSettings) setUserSettings(JSON.parse(savedSettings));
        else setUserSettings({
          soundEnabled: true,
          aiResponseStyle: 'detailed',
          defaultQuestionCount: 5,
          theme: 'light',
          uiTheme: 'standard'
        });

        // After sign in: prompt "What should I call you knowledge seeker"
        setOnboardingStep('username');
        setOnboardingTargetHours(5);
        setOnboardingTargetExams(3);
        setView('name-prompt');
        playSound('success');
      }
    } catch (err) {
      setAuthError('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleKnowledgeSeekerNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenName = knowledgeSeekerName.trim();
    if (!chosenName) return;
    playSound('pop');
    setOnboardingStep('target');
  };

  const handleWeeklyTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenName = knowledgeSeekerName.trim() || 'Scholar';
    const newProfile: UserProfile = {
      ...userProfile,
      name: chosenName
    };
    saveProfile(newProfile);

    const hours = Math.max(1, Number(onboardingTargetHours) || 5);
    const exams = Math.max(1, Number(onboardingTargetExams) || 3);
    const newGoals: WeeklyGoals = {
      targetHours: hours,
      targetExams: exams
    };
    setWeeklyGoals(newGoals);

    if (currentUser) {
      localStorage.setItem(`weeklyGoals_${currentUser}`, JSON.stringify(newGoals));
      localStorage.setItem(`name_prompted_${currentUser}`, 'true');
    }

    playSound('success');
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('local_current_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setKnowledgeSeekerName('');
    setOnboardingStep('username');
    setOnboardingTargetHours(5);
    setOnboardingTargetExams(3);
    setExams([]);
    setAttempts([]);
    setStudyMaterials([]);
    setGeneralChat([]);
    setCompanionDraft('');
    setLastChatAutoSavedTime(null);
    setChatAutoSaveStatus('saved');
    setWeeklyGoals({ targetHours: 5, targetExams: 3 });
    setStudyLogs([]);
    setStudyChat([]);
    setUserProfile({
      name: 'Scholar',
      preferredDifficulty: 'Medium',
      frequentSubjects: [],
      grade: ''
    });
    setUserSettings({
      soundEnabled: true,
      aiResponseStyle: 'detailed',
      defaultQuestionCount: 5,
      theme: 'light',
      uiTheme: 'standard'
    });
    setView('auth');
    playSound('pop');
  };

  const lastWhooshRef = useRef<number>(0);

  const playSound = (type: 'click' | 'success' | 'fail' | 'pop' | 'whoosh') => {
    if (!userSettings.soundEnabled) return;

    if (type === 'whoosh') {
      const nowMs = Date.now();
      if (nowMs - lastWhooshRef.current < 200) return;
      lastWhooshRef.current = nowMs;

      // Soft whoosh audio synthesis via Web Audio API for instantaneous response
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const bufferSize = Math.floor(ctx.sampleRate * 0.22);
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const channelData = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            channelData[i] = (Math.random() * 2 - 1) * 0.35;
          }

          const noiseSource = ctx.createBufferSource();
          noiseSource.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.Q.value = 1.8;

          const startTime = ctx.currentTime;
          filter.frequency.setValueAtTime(280, startTime);
          filter.frequency.exponentialRampToValueAtTime(1100, startTime + 0.08);
          filter.frequency.exponentialRampToValueAtTime(280, startTime + 0.22);

          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0.001, startTime);
          gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.06);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.22);

          noiseSource.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          noiseSource.start(startTime);
          noiseSource.stop(startTime + 0.22);
          return;
        }
      } catch (e) {
        // Fallback to audio element if Web Audio API is restricted
      }
    }

    const sounds = {
      click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
      success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
      fail: 'https://assets.mixkit.co/active_storage/sfx/251/251-preview.mp3',
      pop: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
      whoosh: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
    };
    const audio = new Audio(sounds[type]);
    audio.volume = type === 'whoosh' ? 0.2 : 0.3;
    audio.play().catch(() => {}); // Ignore errors if browser blocks autoplay
  };

  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExportPDF = () => {
    if (!currentExam || !currentAttempt) return;
    setIsExportingPDF(true);
    playSound('click');
    try {
      exportExamReportPDF(currentExam, currentAttempt, userProfile.name || 'Scholar');
      playSound('success');
    } catch (err) {
      console.error('Failed to export PDF:', err);
      playSound('fail');
    } finally {
      setTimeout(() => setIsExportingPDF(false), 900);
    }
  };

  const [quickStudyModalOpen, setQuickStudyModalOpen] = useState(false);
  const [quickStudySubject, setQuickStudySubject] = useState('');
  const [quickStudyTopic, setQuickStudyTopic] = useState('');

  const getMostRecentlyAccessedSubject = (): string => {
    if (studyMaterials && studyMaterials.length > 0) {
      return studyMaterials[0].subject;
    }
    if (attempts && attempts.length > 0) {
      const recentExam = exams.find(e => e.id === attempts[0].examId);
      if (recentExam?.subject) return recentExam.subject;
    }
    if (exams && exams.length > 0) {
      return exams[0].subject;
    }
    if (userProfile.frequentSubjects && userProfile.frequentSubjects.length > 0) {
      return userProfile.frequentSubjects[0];
    }
    return 'General Science';
  };

  const handleOpenQuickStudyPrompt = () => {
    playSound('pop');
    const detected = getMostRecentlyAccessedSubject();
    setQuickStudySubject(detected);
    setQuickStudyTopic('');
    setQuickStudyModalOpen(true);
  };

  const handleExecuteQuickStudy = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const subjectToUse = quickStudySubject.trim() || getMostRecentlyAccessedSubject();
    setQuickStudyModalOpen(false);
    setLoading(true);
    setLoadingMessage(`Generating 1-minute flashcard summary for ${subjectToUse}...`);
    playSound('click');

    try {
      const result = await generateQuickStudySummary(
        subjectToUse, 
        userProfile.grade || 'General', 
        quickStudyTopic.trim() || undefined
      );

      const newStudy: StudyMaterial = {
        id: crypto.randomUUID(),
        title: `⚡ 1-Min Summary: ${subjectToUse}`,
        subject: subjectToUse,
        grade: userProfile.grade || 'General',
        content: result.content,
        flashcards: result.flashcards,
        createdAt: Date.now(),
      };

      const updatedStudy = [newStudy, ...studyMaterials];
      setStudyMaterials(updatedStudy);
      if (currentUser) {
        localStorage.setItem(`study_${currentUser}`, JSON.stringify(updatedStudy));
      }

      setCurrentStudy(newStudy);
      setStudyChat([]);
      setView('study-session');
      playSound('success');
    } catch (err) {
      console.error('Failed to generate quick study summary:', err);
      playSound('fail');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudyMaterial = async (
    title: string,
    subject: string,
    grade: string,
    topic?: string
  ) => {
    setLoading(true);
    try {
      const { content, flashcards } = await generateStudyMaterial(subject, grade, topic);
      const newStudy: StudyMaterial = {
        id: crypto.randomUUID(),
        title,
        subject,
        grade,
        content,
        flashcards,
        createdAt: Date.now(),
      };
      
      const updatedStudy = [newStudy, ...studyMaterials];
      setStudyMaterials(updatedStudy);
      if (currentUser) {
        localStorage.setItem(`study_${currentUser}`, JSON.stringify(updatedStudy));
      }
      
      playSound('success');
      setView('study');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (
    title: string, 
    subject: string, 
    grade: string, 
    difficulty: string, 
    topic?: string, 
    additionalDetails?: string,
    count: number = 5
  ) => {
    setLoading(true);
    setLoadingMessage(count > 15 ? 'Generating a large exam... this might take a moment.' : 'Generating your practice test...');
    try {
      let questions: Question[] = [];
      
      if (count > 15) {
        // Parallelize for speed
        const chunks = [];
        let remaining = count;
        while (remaining > 0) {
          const chunkSize = Math.min(remaining, 15);
          chunks.push(generateExamQuestions(subject, grade, difficulty, topic, additionalDetails, chunkSize));
          remaining -= chunkSize;
        }
        const results = await Promise.all(chunks);
        questions = results.flat();
      } else {
        questions = await generateExamQuestions(subject, grade, difficulty, topic, additionalDetails, count);
      }

      if (!questions || questions.length === 0) {
        // Emergency fallback to guarantee exam is always created
        questions = [
          {
            id: crypto.randomUUID(),
            type: 'multiple-choice',
            question: `In ${subject || 'Science'}, what is a primary fundamental concept?`,
            options: ['Empirical investigation and systematic analysis', 'Random assumption', 'Unverified hearsay', 'Subjective preference'],
            correctAnswer: 'Empirical investigation and systematic analysis',
            explanation: `Systematic observation and empirical testing form the foundation of ${subject || 'Science'}.`,
            hint: 'Choose the option rooted in scientific evidence.'
          }
        ];
      }

      const newExam: Exam = {
        id: crypto.randomUUID(),
        title: title || `${subject} Practice Exam`,
        subject: subject || 'General',
        grade: grade || 'All Levels',
        difficulty,
        description: topic ? `Practice test for ${topic.substring(0, 50)}...` : `Practice test for ${subject}`,
        questions,
        createdAt: Date.now(),
      };
      
      const updatedExams = [newExam, ...exams];
      setExams(updatedExams);
      if (currentUser) {
        localStorage.setItem(`exams_${currentUser}`, JSON.stringify(updatedExams));
      }
      
      playSound('success');
      setView('dashboard');
    } catch (error: any) {
      console.error('Failed to create exam:', error);
      playSound('fail');
    } finally {
      setLoading(false);
    }
  };

  const handleStudyChat = async (message: string) => {
    if (!currentStudy) return;
    
    const newUserMessage: ChatMessage = { role: 'user', text: message };
    setStudyChat(prev => [...prev, newUserMessage]);
    setChatLoading(true);
    playSound('click');

    try {
      const response = await askStudyQuestion(currentStudy.content, message, studyChat, userSettings.aiResponseStyle, userProfile.name);
      const newModelMessage: ChatMessage = { role: 'model', text: response };
      setStudyChat(prev => [...prev, newModelMessage]);
      playSound('pop');
    } catch (error) {
      console.error(error);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGeneralChat = async (message: string) => {
    const newUserMessage: ChatMessage = { role: 'user', text: message };
    const updatedChat = [...generalChat, newUserMessage];
    setGeneralChat(updatedChat);
    setChatAutoSaveStatus('saving');
    if (currentUser) {
      localStorage.setItem(`generalChat_${currentUser}`, JSON.stringify(updatedChat));
      localStorage.removeItem(`generalChat_draft_${currentUser}`);
    }
    setChatLoading(true);
    playSound('click');

    try {
      const response = await askGeneralQuestion(message, generalChat, userSettings.aiResponseStyle, userProfile.name);
      const newModelMessage: ChatMessage = { role: 'model', text: response };
      const finalChat = [...updatedChat, newModelMessage];
      setGeneralChat(finalChat);
      if (currentUser) {
        localStorage.setItem(`generalChat_${currentUser}`, JSON.stringify(finalChat));
      }
      setChatAutoSaveStatus('saved');
      setLastChatAutoSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      playSound('pop');
    } catch (error) {
      console.error(error);
    } finally {
      setChatLoading(false);
    }
  };

  const startExam = (exam: Exam) => {
    // Check for in-progress attempt
    const existingAttempt = attempts.find(a => a.examId === exam.id && a.status === 'in-progress');
    
    setCurrentExam(exam);
    if (existingAttempt) {
      setCurrentAttempt(existingAttempt);
    } else {
      setCurrentAttempt({
        id: crypto.randomUUID(),
        examId: exam.id,
        answers: {},
        score: 0,
        completedAt: 0,
        status: 'in-progress',
        currentQuestionIndex: 0,
      });
    }
    setView('exam');
  };

  const saveExamProgress = (attempt: ExamAttempt) => {
    const updatedAttempts = attempts.map(a => a.id === attempt.id ? attempt : a);
    if (!attempts.find(a => a.id === attempt.id)) {
      updatedAttempts.unshift(attempt);
    }
    setAttempts(updatedAttempts);
    if (currentUser) {
      localStorage.setItem(`attempts_${currentUser}`, JSON.stringify(updatedAttempts));
    }
  };

  const finishExam = async (answers: Record<string, string>) => {
    if (!currentExam || !currentAttempt) return;
    
    setLoading(true);
    try {
      const { feedback, aiScore, reviewedAnswers } = await getExamFeedback(currentExam.title, currentExam.questions, answers);

      const completedAttempt: ExamAttempt = {
        ...currentAttempt,
        answers,
        reviewedAnswers,
        score: aiScore,
        completedAt: Date.now(),
        feedback,
        status: 'completed'
      };

      const updatedAttempts = attempts.map(a => a.id === completedAttempt.id ? completedAttempt : a);
      setAttempts(updatedAttempts);
      if (currentUser) {
        localStorage.setItem(`attempts_${currentUser}`, JSON.stringify(updatedAttempts));
      }

      setCurrentAttempt(completedAttempt);
      setView('results');
      if (aiScore >= 70) playSound('success');
      else playSound('fail');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profile: UserProfile) => {
    if (currentUser) {
      localStorage.setItem(`profile_${currentUser}`, JSON.stringify(profile));
      
      // Also update the user record in local_users
      const users = JSON.parse(localStorage.getItem('local_users') || '{}');
      if (users[currentUser]) {
        users[currentUser].profile = profile;
        localStorage.setItem('local_users', JSON.stringify(users));
      }
    }
    setUserProfile(profile);
    if (profile.name) setKnowledgeSeekerName(profile.name);
    playSound('success');
  };

  const saveSettings = async (settings: UserSettings) => {
    if (currentUser) {
      localStorage.setItem(`settings_${currentUser}`, JSON.stringify(settings));
    }
    setUserSettings(settings);
    playSound('success');
  };

  const clearAllData = () => {
    if (currentUser && confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      localStorage.removeItem(`exams_${currentUser}`);
      localStorage.removeItem(`attempts_${currentUser}`);
      localStorage.removeItem(`profile_${currentUser}`);
      localStorage.removeItem(`study_${currentUser}`);
      localStorage.removeItem(`generalChat_${currentUser}`);
      localStorage.removeItem(`settings_${currentUser}`);
      
      setExams([]);
      setAttempts([]);
      setStudyMaterials([]);
      setGeneralChat([]);
      setUserProfile({
        name: 'Scholar',
        preferredDifficulty: 'Medium',
        frequentSubjects: [],
        grade: ''
      });
      setUserSettings({
        soundEnabled: true,
        aiResponseStyle: 'detailed',
        defaultQuestionCount: 5,
        theme: 'light',
        uiTheme: 'standard'
      });
      playSound('pop');
      setView('dashboard');
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500",
      `theme-${userSettings.uiTheme}`
    )}>
      {/* Animated Background Decorations */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {userSettings.uiTheme === 'anime' && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,0,0,0.2),transparent_50%)] animate-pulse" />
        )}
        
        {userSettings.uiTheme === 'midnight' && (
          <>
            <div className="shooting-star" style={{ top: '10%', left: '90%', animationDelay: '0s' }} />
            <div className="shooting-star" style={{ top: '30%', left: '80%', animationDelay: '4s' }} />
            <div className="shooting-star" style={{ top: '50%', left: '95%', animationDelay: '8s' }} />
          </>
        )}

        {userSettings.uiTheme === 'nature' && (
          <>
            <div className="leaf-particle w-4 h-6" style={{ left: '10%', animationDelay: '0s' }} />
            <div className="leaf-particle w-3 h-5" style={{ left: '30%', animationDelay: '2s' }} />
            <div className="leaf-particle w-5 h-7" style={{ left: '60%', animationDelay: '5s' }} />
            <div className="leaf-particle w-4 h-6" style={{ left: '85%', animationDelay: '7s' }} />
            {/* Fireflies */}
            <div className="firefly" style={{ top: '20%', left: '15%', '--tx': '100px', '--ty': '-150px' } as any} />
            <div className="firefly" style={{ top: '60%', left: '40%', '--tx': '-150px', '--ty': '-200px' } as any} />
            <div className="firefly" style={{ top: '40%', left: '75%', '--tx': '200px', '--ty': '-100px' } as any} />
            <div className="firefly" style={{ top: '80%', left: '20%', '--tx': '50px', '--ty': '-300px' } as any} />
          </>
        )}

        {userSettings.uiTheme === 'sunset' && (
          <>
            <div className="sun-glow" style={{ top: '-100px', right: '-100px' }} />
            <div className="retro-sun" />
            <div className="scanline" />
          </>
        )}

        <FloatingIcon Icon={Book} delay={0} x="10%" y="20%" size={40} />
        <FloatingIcon Icon={Pencil} delay={2} x="85%" y="15%" size={32} />
        <FloatingIcon Icon={Atom} delay={4} x="75%" y="70%" size={48} />
        <FloatingIcon Icon={Globe} delay={1} x="15%" y="80%" size={36} />
        <FloatingIcon Icon={CalcIcon} delay={3} x="50%" y="10%" size={28} />
        <FloatingIcon Icon={Brain} delay={5} x="45%" y="85%" size={44} />
        <FloatingIcon Icon={GraduationCap} delay={2.5} x="90%" y="50%" size={38} onClick={() => playSound('success')} />
        <FloatingIcon Icon={Trophy} delay={6} x="5%" y="50%" size={30} />
        <FloatingIcon Icon={Search} delay={1.5} x="30%" y="90%" size={24} />
        <FloatingIcon Icon={Settings} delay={4.5} x="60%" y="80%" size={34} />
        <FloatingIcon Icon={Mail} delay={3.5} x="20%" y="5%" size={26} />
        <FloatingIcon Icon={Lock} delay={0.5} x="80%" y="30%" size={22} />
        <FloatingIcon Icon={Github} delay={5.5} x="95%" y="85%" size={28} />
        <FloatingIcon Icon={Chrome} delay={2.2} x="40%" y="40%" size={32} />
        <FloatingIcon Icon={Clock} delay={0.8} x="65%" y="5%" size={28} />
        <FloatingIcon Icon={Lightbulb} delay={4.2} x="25%" y="65%" size={36} />
        <FloatingIcon Icon={User} delay={1.8} x="80%" y="85%" size={30} />
        <FloatingIcon Icon={Save} delay={5.2} x="15%" y="45%" size={24} />
        <FloatingIcon Icon={BookOpen} delay={2.8} x="70%" y="40%" size={32} />
        <FloatingIcon Icon={History} delay={1.2} x="35%" y="15%" size={28} />
        <FloatingIcon Icon={LayoutDashboard} delay={4.8} x="55%" y="60%" size={34} />
        <FloatingIcon Icon={CheckCircle2} delay={3.2} x="10%" y="75%" size={26} />
        <FloatingIcon Icon={XCircle} delay={0.5} x="90%" y="25%" size={22} />
      </div>

      {/* Header */}
      {isLoggedIn && view !== 'name-prompt' && (
        <header className="sticky top-0 z-50 glass border-b border-slate-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Graduation Cap Button */}
              <div 
                id="header-graduation-cap-btn"
                className="cursor-pointer group select-none shrink-0" 
                onMouseEnter={() => playSound('whoosh')}
                onClick={() => { 
                  setView('dashboard'); 
                  playSound('success'); 
                }}
                title="Click me to ace exams!"
              >
                <motion.div 
                  whileHover={{ rotate: 18, scale: 1.15 }}
                  whileTap={{ scale: 0.9, rotate: -15 }}
                  className="w-10 h-10 bg-linear-to-br from-brand-500 to-accent-purple rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200 ring-2 ring-brand-500/20 active:scale-95 transition-all"
                >
                  <GraduationCap size={24} className="group-hover:scale-110 transition-transform" />
                </motion.div>
              </div>

              {/* Column with SmartCells Word and "Click me to ace exams" Word directly below it */}
              <div className="flex flex-col items-start select-none">
                <h1 
                  id="smartcells-word"
                  className="text-xl sm:text-2xl font-black gradient-text leading-tight cursor-pointer select-none tracking-tight hover:opacity-85 transition-opacity"
                  onClick={() => { 
                    setView('dashboard'); 
                    playSound('pop'); 
                  }}
                  title="SmartCells Home"
                >
                  SmartCells
                </h1>

                {/* "Click me to ace exams" badge moved directly below "SmartCells" word */}
                <motion.div
                  id="ace-exams-badge"
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.18, 
                    y: -1,
                    transition: { type: 'spring', stiffness: 500, damping: 12 } 
                  }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setView('dashboard');
                    playSound('success');
                  }}
                  className="mt-0.5 flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 hover:bg-amber-100/90 border border-amber-300 text-amber-900 rounded-md text-[9px] font-black tracking-tight shadow-xs hover:shadow-md cursor-pointer select-none transition-all group"
                  title="Click me to ace exams!"
                >
                  <motion.span 
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-amber-600 font-extrabold text-[10px] leading-none flex items-center justify-center"
                  >
                    <ArrowUp size={11} className="stroke-[3]" />
                  </motion.span>
                  <span className="whitespace-nowrap">Click me to ace exams</span>
                </motion.div>
              </div>
            </div>

            <nav className="flex items-center gap-1 sm:gap-4">
              <button 
                onClick={() => { setView('dashboard'); playSound('click'); }}
                className={cn(
                  "p-2 rounded-lg transition-all flex items-center gap-2 pop-hover",
                  view === 'dashboard' ? "bg-brand-50 text-brand-600 shadow-sm" : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <LayoutDashboard size={20} />
                <span className="text-sm font-medium hidden md:block">Dashboard</span>
              </button>
              <button 
                onClick={() => { setView('study'); playSound('click'); }}
                className={cn(
                  "p-2 rounded-lg transition-all flex items-center gap-2 pop-hover",
                  view === 'study' || view === 'study-session' ? "bg-brand-50 text-brand-600 shadow-sm" : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <BookOpen size={20} />
                <span className="text-sm font-medium hidden md:block">Study</span>
              </button>
              <button 
                onClick={() => { setView('companion'); playSound('click'); }}
                className={cn(
                  "p-2 rounded-lg transition-all flex items-center gap-2 pop-hover",
                  view === 'companion' ? "bg-brand-50 text-brand-600 shadow-sm" : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <Brain size={20} />
                <span className="text-sm font-medium hidden md:block">AI Companion</span>
              </button>
              <button 
                onClick={() => { setView('tools'); playSound('click'); }}
                className={cn(
                  "p-2 rounded-lg transition-all flex items-center gap-2 pop-hover",
                  view === 'tools' ? "bg-brand-50 text-brand-600 shadow-sm" : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <Wrench size={20} />
                <span className="text-sm font-medium hidden md:block">Tools</span>
              </button>
              <button 
                onClick={() => { setView('history'); playSound('click'); }}
                className={cn(
                  "p-2 rounded-lg transition-all flex items-center gap-2 pop-hover",
                  view === 'history' ? "bg-brand-50 text-brand-600 shadow-sm" : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <History size={20} />
                <span className="text-sm font-medium hidden md:block">History</span>
              </button>
              <button 
                onClick={() => { setView('settings'); playSound('click'); }}
                className={cn(
                  "p-2 rounded-lg transition-all flex items-center gap-2 pop-hover",
                  view === 'settings' ? "bg-brand-50 text-brand-600 shadow-sm" : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <Settings size={20} />
                <span className="text-sm font-medium hidden md:block">Settings</span>
              </button>
              <button 
                onClick={() => { setView('profile'); playSound('click'); }}
                className={cn(
                  "p-2 rounded-lg transition-all flex items-center gap-2 pop-hover",
                  view === 'profile' ? "bg-brand-50 text-brand-600 shadow-sm" : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <User size={20} />
                <span className="text-sm font-medium hidden md:block">{userProfile.name || 'Profile'}</span>
              </button>
              <button 
                onClick={() => { setView('create'); playSound('pop'); }}
                className="ml-2 bg-linear-to-r from-brand-500 to-accent-purple hover:from-brand-600 hover:to-accent-pink text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md shadow-brand-100 active:scale-95"
              >
                <Plus size={18} />
                <span className="text-sm font-medium">New Exam</span>
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg transition-all flex items-center gap-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                title="Logout"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium hidden md:block">Logout</span>
              </button>
            </nav>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {view === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md mx-auto mt-12 bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                  <GraduationCap size={32} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {authMode === 'login' ? 'Welcome Back' : 'Join SmartCells'}
                </h2>
                <p className="text-slate-500 mt-2">
                  {authMode === 'login' ? 'Sign in to continue your journey' : 'Start your AI-powered learning today'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="scholar@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100"
                  >
                    {authError}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); playSound('click'); }}
                  className="text-brand-600 font-semibold hover:underline"
                >
                  {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                </button>
              </div>
            </motion.div>
          )}

          {view === 'name-prompt' && (
            <motion.div
              key={`name-prompt-${onboardingStep}`}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="max-w-md mx-auto mt-12 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative subtle background aura */}
              <div className="absolute -top-20 -right-20 w-44 h-44 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none" />

              {onboardingStep === 'username' ? (
                <>
                  <div className="text-center mb-8 relative z-10">
                    <motion.div 
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
                      className="w-20 h-20 bg-linear-to-tr from-brand-500 to-accent-purple rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-brand-500/25"
                    >
                      <Sparkles size={38} className="animate-pulse" />
                    </motion.div>
                    
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      What should I call you <span className="gradient-text">knowledge seeker</span>?
                    </h2>
                    <p className="text-slate-500 mt-3 text-sm sm:text-base leading-relaxed">
                      Enter your username so we can address you properly throughout your journey.
                    </p>
                  </div>

                  <form onSubmit={handleKnowledgeSeekerNameSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                      <label htmlFor="knowledge-seeker-input" className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-left">
                        Your Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          id="knowledge-seeker-input"
                          type="text"
                          required
                          autoFocus
                          value={knowledgeSeekerName}
                          onChange={(e) => setKnowledgeSeekerName(e.target.value)}
                          placeholder="e.g. SmartCells"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-lg font-semibold text-slate-800 transition-all placeholder:text-slate-400 placeholder:font-normal"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="confirm-knowledge-seeker-btn"
                      className="w-full bg-linear-to-r from-brand-500 to-accent-purple hover:from-brand-600 hover:to-accent-pink text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg pop-hover cursor-pointer"
                    >
                      <span>Continue</span>
                      <ChevronRight size={22} />
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      Sign in with a different account
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-8 relative z-10">
                    <motion.div 
                      initial={{ scale: 0, rotate: 20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
                      className="w-20 h-20 bg-linear-to-tr from-amber-500 to-brand-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-amber-500/25"
                    >
                      <Target size={38} className="animate-pulse" />
                    </motion.div>
                    
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      What is your weekly target <span className="gradient-text">Mr. intelligent</span>?
                    </h2>
                    <p className="text-slate-500 mt-3 text-sm sm:text-base leading-relaxed">
                      Set your weekly target to personalize your study goals and progress tracker.
                    </p>
                  </div>

                  <form onSubmit={handleWeeklyTargetSubmit} className="space-y-5 relative z-10">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                          Weekly Study Hours
                        </label>
                        <span className="text-sm font-extrabold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                          {onboardingTargetHours} hrs / week
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {[3, 5, 10, 15].map((hrs) => (
                          <button
                            key={hrs}
                            type="button"
                            onClick={() => { setOnboardingTargetHours(hrs); playSound('click'); }}
                            className={cn(
                              "py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                              onboardingTargetHours === hrs
                                ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                            )}
                          >
                            {hrs}h
                          </button>
                        ))}
                      </div>

                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="number"
                          min={1}
                          max={60}
                          value={onboardingTargetHours}
                          onChange={(e) => setOnboardingTargetHours(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 font-bold text-slate-800"
                          placeholder="Target study hours"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                          Weekly Practice Exams
                        </label>
                        <span className="text-sm font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                          {onboardingTargetExams} exams / week
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 5].map((count) => (
                          <button
                            key={count}
                            type="button"
                            onClick={() => { setOnboardingTargetExams(count); playSound('click'); }}
                            className={cn(
                              "py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                              onboardingTargetExams === count
                                ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                            )}
                          >
                            {count} {count === 1 ? 'exam' : 'exams'}
                          </button>
                        ))}
                      </div>

                      <div className="relative">
                        <Brain className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={onboardingTargetExams}
                          onChange={(e) => setOnboardingTargetExams(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 font-bold text-slate-800"
                          placeholder="Target exams count"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => { setOnboardingStep('username'); playSound('click'); }}
                        className="px-4 py-3.5 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all text-sm cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        id="confirm-weekly-target-btn"
                        className="flex-1 bg-linear-to-r from-brand-500 to-accent-purple hover:from-brand-600 hover:to-accent-pink text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-brand-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-base pop-hover cursor-pointer"
                      >
                        <span>Apply & Enter SmartCells</span>
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                <div className="space-y-2">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black text-slate-900 tracking-tight"
                  >
                    Welcome back, <span className="gradient-text">{userProfile.name}</span>!
                  </motion.h2>
                  <p className="text-slate-500 text-lg">
                    Ready to conquer your next exam?
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search exams..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 w-full md:w-56 transition-all shadow-sm"
                    />
                  </motion.div>
                  
                  {/* Quick Study Button on Dashboard */}
                  <button 
                    id="quick-study-btn"
                    onClick={handleOpenQuickStudyPrompt}
                    className="bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2 active:scale-95 cursor-pointer pop-hover"
                    title="Generate a 1-minute flashcard summary of your most recently accessed subject"
                  >
                    <Zap size={18} className="fill-amber-100 text-white animate-pulse" />
                    <span className="whitespace-nowrap">Quick Study</span>
                  </button>

                  <button 
                    onClick={() => setView('create')}
                    className="bg-brand-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-100 flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Plus size={20} />
                    <span>New</span>
                  </button>
                </div>
              </div>

              {/* Quick Study Spotlight Banner */}
              <div className="bg-linear-to-r from-amber-500/10 via-orange-500/5 to-brand-500/10 border border-amber-200/90 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-linear-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-amber-500/25 shrink-0">
                    <Zap size={24} className="fill-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-slate-900">Need a 1-Minute Flashcard Review?</h4>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                        60s Recall
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      Generate rapid flashcards & summary for your recent subject: <span className="font-bold text-amber-700">{getMostRecentlyAccessedSubject()}</span>.
                    </p>
                  </div>
                </div>
                <button
                  id="quick-study-banner-btn"
                  onClick={handleOpenQuickStudyPrompt}
                  className="whitespace-nowrap px-4 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all pop-hover cursor-pointer"
                >
                  <Zap size={15} className="fill-white" />
                  <span>Start Quick Study</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Your Practice Exams</h3>
                <span className="text-sm font-semibold text-slate-400">{filteredExams.length} {filteredExams.length === 1 ? 'Exam' : 'Exams'}</span>
              </div>

              {filteredExams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">No exams yet</h3>
                  <p className="text-slate-500 mb-6">Create your first AI-powered practice test to get started.</p>
                  <button 
                    onClick={() => setView('create')}
                    className="bg-brand-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-brand-600 transition-all"
                  >
                    Create Exam
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredExams.map((exam) => {
                    const inProgressAttempt = attempts.find(a => a.examId === exam.id && a.status === 'in-progress');
                    
                    return (
                      <motion.div 
                        key={exam.id}
                        layoutId={exam.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white p-6 rounded-3xl border border-slate-200 card-hover group cursor-pointer relative overflow-hidden"
                        onClick={() => { startExam(exam); playSound('pop'); }}
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150" />
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl group-hover:bg-brand-500 group-hover:text-white transition-colors">
                            <Brain size={24} />
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md uppercase tracking-wider">
                              {exam.subject}
                            </span>
                            {inProgressAttempt && (
                              <span className="text-[10px] font-black px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full uppercase tracking-tighter animate-pulse">
                                In Progress
                              </span>
                            )}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{exam.title}</h3>
                        <p className="text-slate-500 text-sm mb-6 line-clamp-2">{exam.description}</p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Clock size={14} />
                            <span>{exam.questions.length} Questions</span>
                          </div>
                          <div className={cn(
                            "font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform",
                            inProgressAttempt ? "text-amber-500" : "text-brand-500"
                          )}>
                            {inProgressAttempt ? 'Resume' : 'Start'} <ChevronRight size={16} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Weekly Goals & Progress Feature - positioned below create exams / practice exams */}
              <div className="pt-6 border-t border-slate-200/80">
                <WeeklyGoalTracker
                  goals={weeklyGoals}
                  onUpdateGoals={handleUpdateWeeklyGoals}
                  studyLogs={studyLogs}
                  onAddStudyLog={handleAddStudyLog}
                  attempts={attempts}
                  playSound={playSound}
                />
              </div>
            </motion.div>
          )}

          {view === 'study' && (
            <motion.div 
              key="study"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Study <span className="gradient-text">Materials</span></h2>
                  <p className="text-slate-500 text-lg">Master your subjects with AI-generated study guides.</p>
                </div>
                <button 
                  onClick={() => setView('create')}
                  className="bg-brand-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-100 flex items-center gap-2 active:scale-95"
                >
                  <Plus size={20} />
                  New Study Guide
                </button>
              </div>

              {studyMaterials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">No study guides yet</h3>
                  <p className="text-slate-500 mb-6">Create your first AI-powered study guide to get started.</p>
                  <button 
                    onClick={() => setView('create')}
                    className="bg-brand-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-brand-600 transition-all"
                  >
                    Create Study Guide
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studyMaterials.map((study) => (
                    <motion.div 
                      key={study.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white p-6 rounded-3xl border border-slate-200 card-hover group cursor-pointer relative overflow-hidden"
                      onClick={() => { setCurrentStudy(study); setStudyChat([]); setView('study-session'); playSound('pop'); }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150" />
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-brand-50 text-brand-600 rounded-xl group-hover:bg-brand-500 group-hover:text-white transition-colors">
                          <BookOpen size={24} />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md uppercase tracking-wider">
                          {study.subject}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{study.title}</h3>
                      <p className="text-slate-500 text-sm mb-6 line-clamp-2">Study guide for {study.subject} ({study.grade})</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <Brain size={14} />
                          <span>{study.flashcards.length} Flashcards</span>
                        </div>
                        <div className="text-brand-500 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Study <ChevronRight size={16} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {view === 'study-session' && currentStudy && (
            <motion.div 
              key="study-session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => { setView('study'); setStudyChat([]); }}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
                >
                  <ArrowLeft size={20} />
                  Back to Study Materials
                </button>
                <h2 className="text-2xl font-bold text-slate-900">{currentStudy.title}</h2>
              </div>

              <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl prose prose-slate max-w-none">
                <ReactMarkdown>{currentStudy.content}</ReactMarkdown>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900">Flashcards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentStudy.flashcards.map((card, idx) => (
                    <Flashcard key={idx} question={card.question} answer={card.answer} playSound={playSound} />
                  ))}
                </div>
              </div>

              {/* AI Companion Chat */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[500px]">
                <div className="p-4 bg-brand-500 text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Brain size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">AI Study Companion</h3>
                    <p className="text-xs text-white/70">Ask me anything about this material!</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                  {studyChat.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                      <p>No questions yet. Try asking "Can you summarize the main points?"</p>
                    </div>
                  )}
                    {studyChat.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                          msg.role === 'user' 
                            ? "ml-auto bg-brand-500 text-white rounded-tr-none" 
                            : "mr-auto bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                        )}
                      >
                        <div className="prose prose-sm prose-slate max-w-none dark:prose-invert">
                          <ReactMarkdown>
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      </motion.div>
                    ))}
                  {chatLoading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mr-auto bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2"
                    >
                      <Loader2 size={16} className="animate-spin text-brand-500" />
                      <span className="text-xs text-slate-400 font-medium">Thinking...</span>
                    </motion.div>
                  )}
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleStudyChat(input.value.trim());
                      input.value = '';
                    }
                  }}
                  className="p-4 bg-white border-t border-slate-100 flex gap-2"
                >
                  <input 
                    name="message"
                    placeholder="Type your question..."
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={chatLoading}
                    className="bg-brand-500 text-white p-2 rounded-xl hover:bg-brand-600 transition-all disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {view === 'create' && (
            <motion.div 
              key="create"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Content</h2>
                <p className="text-slate-500">Tell Gemini what you want to study, and it will generate custom materials for you.</p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const mode = formData.get('mode') as string;
                if (mode === 'study') {
                  handleCreateStudyMaterial(
                    formData.get('title') as string,
                    formData.get('subject') as string,
                    formData.get('grade') as string,
                    formData.get('topic') as string
                  );
                } else {
                  handleCreateExam(
                    formData.get('title') as string,
                    formData.get('subject') as string,
                    formData.get('grade') as string,
                    formData.get('difficulty') as string,
                    formData.get('topic') as string,
                    formData.get('additionalDetails') as string,
                    Number(formData.get('count'))
                  );
                }
              }} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Content Type</label>
                    <select 
                      name="mode"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    >
                      <option value="exam">Practice Exam</option>
                      <option value="study">Study Guide & Flashcards</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Title</label>
                    <input 
                      name="title" 
                      required 
                      placeholder="e.g. Midterm Physics Prep"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Subject</label>
                    <input 
                      name="subject" 
                      required 
                      defaultValue={userProfile.frequentSubjects[0] || ''}
                      placeholder="e.g. Science"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Grade / Level</label>
                    <input 
                      name="grade" 
                      required 
                      defaultValue={userProfile.grade || ''}
                      placeholder="e.g. Grade 10 or University"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Difficulty (Exams Only)</label>
                    <select 
                      name="difficulty" 
                      defaultValue={userProfile.preferredDifficulty}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Number of Questions (Max 45)</label>
                    <input 
                      name="count" 
                      type="number"
                      min={1}
                      max={45}
                      defaultValue={userSettings.defaultQuestionCount}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex justify-between">
                    Topic or Study Material
                    <span className="text-xs font-normal text-slate-400 italic">Optional</span>
                  </label>
                  <textarea 
                    name="topic" 
                    rows={3}
                    placeholder="Paste notes or describe the topic..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex justify-between">
                    Additional Details (Exams Only)
                    <span className="text-xs font-normal text-slate-400 italic">Optional</span>
                  </label>
                  <textarea 
                    name="additionalDetails" 
                    rows={2}
                    placeholder="e.g. Focus on Newtonian mechanics, exclude thermodynamics..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setView('dashboard')}
                    className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-brand-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-600 transition-all shadow-lg shadow-brand-100 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain size={20} />
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {view === 'exam' && currentExam && currentAttempt && (
            <ExamSession 
              exam={currentExam} 
              attempt={currentAttempt}
              onFinish={finishExam} 
              onCancel={() => setView('dashboard')}
              onSaveProgress={saveExamProgress}
              playSound={playSound}
            />
          )}

          {view === 'results' && currentExam && currentAttempt && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center">
                <div className="w-20 h-20 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy size={40} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Exam Completed!</h2>
                <p className="text-slate-500 mb-8">You've finished your practice session for {currentExam.title}.</p>
                
                <div className="flex justify-center gap-12 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-black text-brand-500">{currentAttempt.score}%</div>
                    <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-slate-900">
                      {Object.values(currentAttempt.answers).length}/{currentExam.questions.length}
                    </div>
                    <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Answered</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl text-left border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Brain size={18} className="text-brand-500" />
                    AI Feedback
                  </h3>
                  <div className="prose prose-slate prose-sm max-w-none">
                    <ReactMarkdown>{currentAttempt.feedback || ''}</ReactMarkdown>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button 
                    id="export-exam-pdf-btn"
                    onClick={handleExportPDF}
                    disabled={isExportingPDF}
                    className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer pop-hover disabled:opacity-75"
                    title="Export exam feedback, score report, and review notes as a downloadable PDF"
                  >
                    {isExportingPDF ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download size={18} />
                        <span>Export PDF Notes & Feedback</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => startExam(currentExam)}
                    className="flex-1 bg-brand-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-600 transition-all shadow-lg shadow-brand-100 cursor-pointer"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => setView('dashboard')}
                    className="px-6 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Review Questions</h3>
                    <p className="text-xs text-slate-500">Detailed answers and coaching notes</p>
                  </div>
                  <button 
                    id="export-exam-pdf-btn-header"
                    onClick={handleExportPDF}
                    disabled={isExportingPDF}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    title="Download review notes as PDF"
                  >
                    <Download size={14} />
                    <span>Download PDF</span>
                  </button>
                </div>
                {currentExam.questions.map((q, idx) => {
                  const userAnswer = currentAttempt.answers[q.id];
                  const isCorrect = currentAttempt.reviewedAnswers?.[q.id] ?? (userAnswer?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim());
                  return (
                    <motion.div 
                      key={q.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white p-6 rounded-2xl border border-slate-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                          isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        )}>
                          {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                        </div>
                        <div className="space-y-3">
                          <p className="font-semibold text-slate-900">Question {idx + 1}: {q.question}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Your Answer</span>
                              <span className={cn("font-medium", isCorrect ? "text-green-600" : "text-red-600")}>
                                {userAnswer || 'No answer'}
                              </span>
                            </div>
                            <div className="p-3 bg-brand-50 rounded-lg border border-brand-100">
                              <span className="text-xs font-bold text-brand-400 uppercase block mb-1">Correct Answer</span>
                              <span className="font-medium text-brand-600">{q.correctAnswer}</span>
                            </div>
                          </div>
                          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <p className="text-sm text-amber-800 leading-relaxed">
                              <span className="font-bold">Explanation:</span> {q.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === 'companion' && (
            <motion.div 
              key="companion"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-8 h-[calc(100vh-250px)] flex flex-col"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI <span className="gradient-text">Companion</span></h2>
                    {/* Real-time Auto-save status badge */}
                    <div 
                      id="chat-autosave-indicator"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-600 shadow-xs transition-all"
                    >
                      {chatAutoSaveStatus === 'saving' ? (
                        <>
                          <RefreshCw size={12} className="text-amber-500 animate-spin" />
                          <span className="text-amber-600 font-medium">Auto-saving...</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                          <span className="text-slate-600 font-medium">
                            {lastChatAutoSavedTime ? `Auto-saved (${lastChatAutoSavedTime})` : 'Auto-save active'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-500 text-lg">Your personal academic assistant, ready to help with anything.</p>
                </div>
                <button 
                  id="clear-companion-chat-btn"
                  onClick={() => { 
                    setGeneralChat([]); 
                    setCompanionDraft('');
                    setLastChatAutoSavedTime(null);
                    setChatAutoSaveStatus('saved');
                    if (currentUser) {
                      localStorage.removeItem(`generalChat_${currentUser}`);
                      localStorage.removeItem(`generalChat_draft_${currentUser}`);
                    }
                    playSound('click'); 
                  }}
                  className="px-4 py-2 text-slate-500 hover:text-slate-900 font-medium transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <History size={18} />
                  Clear Chat
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col flex-1">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                  {generalChat.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
                      <div className="w-20 h-20 bg-brand-50 text-brand-500 rounded-3xl flex items-center justify-center shadow-lg shadow-brand-100 animate-bounce">
                        <Brain size={40} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">How can I help you today{userProfile.name ? `, ${userProfile.name}` : ''}?</h3>
                        <p className="text-slate-500">Ask me to explain a complex topic, help with homework, or just brainstorm ideas.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                        {[
                          "Explain Quantum Physics like I'm 5",
                          "Help me write a history essay",
                          "Solve a math problem",
                          "Summarize the French Revolution"
                        ].map((suggestion) => (
                          <button 
                            key={suggestion}
                            onClick={() => {
                              setCompanionDraft('');
                              handleGeneralChat(suggestion);
                            }}
                            className="p-3 text-sm bg-white border border-slate-200 rounded-xl hover:border-brand-500 hover:text-brand-500 transition-all text-left font-medium shadow-sm cursor-pointer"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {generalChat.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed shadow-sm",
                        msg.role === 'user' 
                          ? "ml-auto bg-brand-500 text-white rounded-tr-none" 
                          : "mr-auto bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                      )}
                    >
                      <div className="prose prose-sm prose-slate max-w-none dark:prose-invert">
                        <ReactMarkdown>
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </motion.div>
                  ))}
                  {chatLoading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mr-auto bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3"
                    >
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" />
                      </div>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Thinking</span>
                    </motion.div>
                  )}
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (companionDraft.trim()) {
                      const msg = companionDraft.trim();
                      setCompanionDraft('');
                      handleGeneralChat(msg);
                    }
                  }}
                  className="p-6 bg-white border-t border-slate-100 flex gap-3"
                >
                  <input 
                    name="message"
                    id="companion-chat-input"
                    value={companionDraft}
                    onChange={(e) => setCompanionDraft(e.target.value)}
                    placeholder="Ask anything... (auto-saved)"
                    className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-lg"
                  />
                  <button 
                    type="submit"
                    id="send-companion-msg-btn"
                    disabled={chatLoading || !companionDraft.trim()}
                    className="bg-brand-500 text-white p-4 rounded-2xl hover:bg-brand-600 transition-all disabled:opacity-50 shadow-lg shadow-brand-100 active:scale-95 cursor-pointer"
                  >
                    <Send size={24} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
          {view === 'tools' && (
            <ToolsView playSound={playSound} />
          )}

          {view === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-slate-900">Study History</h2>
              
              {attempts.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
                  <History size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500">You haven't completed any exams yet.</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Exam</th>
                        <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attempts.map((attempt) => {
                        const exam = exams.find(e => e.id === attempt.examId);
                        return (
                          <tr key={attempt.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900">{exam?.title || 'Deleted Exam'}</div>
                              <div className="text-xs text-slate-400">{exam?.subject}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-sm">
                              {new Date(attempt.completedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-sm font-bold",
                                attempt.score >= 80 ? "bg-green-100 text-green-700" :
                                attempt.score >= 50 ? "bg-amber-100 text-amber-700" :
                                "bg-red-100 text-red-700"
                              )}>
                                {attempt.score}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => {
                                  if (exam) {
                                    setCurrentExam(exam);
                                    setCurrentAttempt(attempt);
                                    setView('results');
                                  }
                                }}
                                className="text-brand-500 hover:text-brand-600 font-semibold text-sm"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {view === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-linear-to-br from-brand-500 to-accent-purple rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <User size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">User Profile</h2>
                    <p className="text-slate-500">Manage your study preferences and settings.</p>
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newProfile: UserProfile = {
                    name: formData.get('name') as string,
                    preferredDifficulty: formData.get('preferredDifficulty') as string,
                    grade: formData.get('grade') as string,
                    frequentSubjects: (formData.get('frequentSubjects') as string).split(',').map(s => s.trim()).filter(Boolean)
                  };
                  saveProfile(newProfile);
                  setView('dashboard');
                }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Display Name</label>
                    <input 
                      name="name" 
                      defaultValue={userProfile.name}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Default Grade / Level</label>
                      <input 
                        name="grade" 
                        defaultValue={userProfile.grade}
                        placeholder="e.g. Grade 10"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Preferred Difficulty</label>
                      <select 
                        name="preferredDifficulty" 
                        defaultValue={userProfile.preferredDifficulty}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Frequent Subjects (comma separated)</label>
                    <input 
                      name="frequentSubjects" 
                      defaultValue={userProfile.frequentSubjects.join(', ')}
                      placeholder="e.g. Science, Math, History"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setView('dashboard')}
                      className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-linear-to-r from-brand-500 to-accent-purple text-white px-6 py-3 rounded-xl font-bold hover:from-brand-600 hover:to-accent-pink transition-all shadow-lg shadow-brand-100 flex items-center justify-center gap-2"
                    >
                      <Save size={20} />
                      Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {view === 'settings' && (() => {
            const progress = getWeeklyExamProgress();
            return (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-linear-to-br from-brand-500 to-accent-purple rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Settings size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">App Settings</h2>
                    <p className="text-slate-500">Customize your SmartCells experience.</p>
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const isReminderOn = formData.get('examReminderEnabled') === 'on';
                  const newSettings: UserSettings = {
                    soundEnabled: formData.get('soundEnabled') === 'on',
                    aiResponseStyle: formData.get('aiResponseStyle') as any,
                    defaultQuestionCount: Number(formData.get('defaultQuestionCount')),
                    theme: formData.get('theme') as any,
                    uiTheme: formData.get('uiTheme') as any,
                    examReminderEnabled: isReminderOn
                  };
                  saveSettings(newSettings);
                  if (isReminderOn) {
                    setTimeout(() => triggerPracticeExamAlert(false), 200);
                  }
                  setView('dashboard');
                }} className="space-y-8">
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Brain size={20} className="text-brand-500" />
                      AI Preferences
                    </h3>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">AI Response Style</label>
                      <p className="text-xs text-slate-400 mb-2">Adjust how Gemini explains concepts to you.</p>
                      <div className="grid grid-cols-3 gap-3">
                        {['concise', 'detailed', 'creative'].map((style) => (
                          <label key={style} className="cursor-pointer">
                            <input 
                              type="radio" 
                              name="aiResponseStyle" 
                              value={style} 
                              defaultChecked={userSettings.aiResponseStyle === style}
                              className="peer sr-only"
                            />
                            <div className="p-3 text-center border border-slate-200 rounded-xl peer-checked:border-brand-500 peer-checked:bg-brand-50 peer-checked:text-brand-600 transition-all text-sm font-medium capitalize">
                              {style}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <LayoutDashboard size={20} className="text-brand-500" />
                      Interface & Behavior
                    </h3>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-slate-900">Sound Effects</p>
                        <p className="text-xs text-slate-500">Enable UI sounds and feedback.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="soundEnabled" 
                          defaultChecked={userSettings.soundEnabled}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Default Exam Size</label>
                      <select 
                        name="defaultQuestionCount" 
                        defaultValue={userSettings.defaultQuestionCount}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                      >
                        {[5, 10, 15, 20, 30, 45].map(n => (
                          <option key={n} value={n}>{n} Questions</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Save size={20} className="text-brand-500" />
                        UI Theme
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'standard', name: 'Standard', color: 'bg-brand-500' },
                          { id: 'midnight', name: 'Midnight', color: 'bg-indigo-900' },
                          { id: 'nature', name: 'Nature', color: 'bg-emerald-500' },
                          { id: 'sunset', name: 'Sunset', color: 'bg-orange-500' },
                          { id: 'anime', name: 'ANIME!', color: 'bg-pink-600' }
                        ].map((t) => (
                          <label key={t.id} className="cursor-pointer">
                            <input 
                              type="radio" 
                              name="uiTheme" 
                              value={t.id} 
                              defaultChecked={userSettings.uiTheme === t.id}
                              className="peer sr-only"
                            />
                            <div className="p-3 border border-slate-200 rounded-xl peer-checked:border-brand-500 peer-checked:bg-brand-50 transition-all flex flex-col items-center gap-2">
                              <div className={cn("w-full h-8 rounded-lg shadow-inner", t.color)} />
                              <span className="text-xs font-bold uppercase tracking-wider">{t.name}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Practice Exam Target Reminders & Notifications */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Bell size={20} className="text-brand-500" />
                        Practice Exam Reminders & Alerts
                      </h3>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-full">
                        Weekly Frequency
                      </span>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-slate-900">Weekly Target Browser Alert</p>
                            {progress.isBehindTarget ? (
                              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                                {progress.remaining} exam{progress.remaining === 1 ? '' : 's'} behind schedule
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                                <CheckCircle2 size={11} /> Target Frequency Met
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Triggers a simple browser alert if you haven't completed enough practice exams within your specified weekly target frequency ({weeklyGoals.targetExams} exams/week).
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                          <input 
                            type="checkbox" 
                            name="examReminderEnabled" 
                            defaultChecked={userSettings.examReminderEnabled}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              setUserSettings(prev => ({ ...prev, examReminderEnabled: isChecked }));
                              if (currentUser) {
                                const updated = { ...userSettings, examReminderEnabled: isChecked };
                                localStorage.setItem(`settings_${currentUser}`, JSON.stringify(updated));
                              }
                              playSound('click');
                              if (isChecked) {
                                setTimeout(() => triggerPracticeExamAlert(false), 200);
                              }
                            }}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                        </label>
                      </div>

                      {/* Frequency stats bar and manual test button */}
                      <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="text-slate-600 flex flex-wrap items-center gap-2">
                          <Target size={14} className="text-brand-500 shrink-0" />
                          <span>
                            Target: <strong className="text-slate-900">{weeklyGoals.targetExams} exams/week</strong>
                          </span>
                          <span className="text-slate-300">•</span>
                          <span>
                            Completed this week: <strong className="text-brand-600">{progress.completedThisWeek}</strong>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => triggerPracticeExamAlert(true)}
                          className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs shadow-xs cursor-pointer active:scale-95 shrink-0"
                          title="Trigger and test the browser alert now"
                        >
                          <BellRing size={13} className="text-brand-500" />
                          <span>Test Reminder Alert</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                      <XCircle size={20} />
                      Danger Zone
                    </h3>
                    <button 
                      type="button"
                      onClick={clearAllData}
                      className="w-full p-4 border border-red-200 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                    >
                      <History size={20} />
                      Clear All Account Data
                    </button>
                  </div>

                  <div className="pt-8 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setView('dashboard')}
                      className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-linear-to-r from-brand-500 to-accent-purple text-white px-6 py-3 rounded-xl font-bold hover:from-brand-600 hover:to-accent-pink transition-all shadow-lg shadow-brand-100 flex items-center justify-center gap-2"
                    >
                      <Save size={20} />
                      Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
            );
          })()}
        </AnimatePresence>
      </main>

      {/* Weekly Exam Target Alert Notification Toast / Banner */}
      <AnimatePresence>
        {inAppAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 sm:right-8 z-50 max-w-md w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 overflow-hidden"
          >
            <div className={cn(
              "absolute top-0 left-0 right-0 h-1.5",
              inAppAlert.type === 'warning' ? "bg-amber-500" : "bg-emerald-500"
            )} />
            <div className="flex items-start gap-3.5">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                inAppAlert.type === 'warning' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
              )}>
                {inAppAlert.type === 'warning' ? <BellRing size={20} className="animate-bounce" /> : <CheckCircle2 size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{inAppAlert.title}</h4>
                  <button
                    onClick={() => setInAppAlert(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {inAppAlert.message}
                </p>
                {inAppAlert.actionLabel && (
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        inAppAlert.onAction?.();
                      }}
                      className={cn(
                        "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer",
                        inAppAlert.type === 'warning'
                          ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                      )}
                    >
                      <span>{inAppAlert.actionLabel}</span>
                      <ChevronRight size={13} />
                    </button>
                    <button
                      onClick={() => setInAppAlert(null)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>© 2026 SmartCells • Powered by Gemini</p>
      </footer>

      {/* Quick Study Prompt Modal */}
      <AnimatePresence>
        {quickStudyModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 pointer-events-none" />
              
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 shrink-0">
                  <Zap size={24} className="fill-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">1-Minute Quick Study</h3>
                  <p className="text-slate-500 text-xs sm:text-sm">Instant 60s summary & active-recall flashcard deck</p>
                </div>
              </div>

              <form onSubmit={handleExecuteQuickStudy} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Subject
                    </label>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                      Recently Accessed
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={quickStudySubject}
                    onChange={(e) => setQuickStudySubject(e.target.value)}
                    placeholder="e.g. Biology, Chemistry, Calculus"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/15 focus:border-amber-500 font-bold text-slate-900 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Specific Chapter or Topic <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={quickStudyTopic}
                    onChange={(e) => setQuickStudyTopic(e.target.value)}
                    placeholder="e.g. Cellular Respiration, Key formulas, Mitosis"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/15 focus:border-amber-500 text-sm text-slate-800 transition-all"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 py-2">
                  <div className="p-2.5 bg-amber-50/70 border border-amber-100 rounded-xl text-center">
                    <span className="block text-amber-600 font-black text-sm">60 Sec</span>
                    <span className="text-[10px] text-slate-500 font-medium">Read Time</span>
                  </div>
                  <div className="p-2.5 bg-orange-50/70 border border-orange-100 rounded-xl text-center">
                    <span className="block text-orange-600 font-black text-sm">Flashcards</span>
                    <span className="text-[10px] text-slate-500 font-medium">Active Recall</span>
                  </div>
                  <div className="p-2.5 bg-purple-50/70 border border-purple-100 rounded-xl text-center">
                    <span className="block text-purple-600 font-black text-sm">{userProfile.grade || 'General'}</span>
                    <span className="text-[10px] text-slate-500 font-medium">Grade Level</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => { setQuickStudyModalOpen(false); playSound('click'); }}
                    className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold rounded-xl text-sm transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="submit-quick-study-btn"
                    className="flex-2 py-3 px-5 bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer pop-hover"
                  >
                    <Zap size={16} className="fill-white" />
                    <span>Generate 1-Min Summary</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white p-12 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 border-4 border-brand-100 rounded-full" />
              <div className="w-24 h-24 border-4 border-brand-500 rounded-full border-t-transparent animate-spin absolute inset-0" />
              <Brain className="absolute inset-0 m-auto text-brand-500 animate-pulse" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Gemini is Thinking</h3>
            <p className="text-slate-500 leading-relaxed">{loadingMessage}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function FloatingIcon({ Icon, delay, x, y, size, onClick }: { Icon: any, delay: number, x: string, y: string, size: number, onClick?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0.6, 1, 0.6],
        y: [0, -40, 0],
        rotate: [0, 15, -15, 0],
        scale: 1
      }}
      whileHover={{ scale: 1.25, cursor: onClick ? 'pointer' : 'default' }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      transition={{ 
        duration: 12, 
        repeat: Infinity, 
        delay,
        ease: "easeInOut"
      }}
      style={{ position: 'absolute', left: x, top: y }}
      className={cn("text-brand-500", onClick && "cursor-pointer hover:text-brand-600")}
    >
      <Icon size={size} />
    </motion.div>
  );
}

function CalculatorTool({ playSound }: { playSound: (type: any) => void }) {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleInput = (val: string) => {
    playSound('click');
    if (val === 'C') {
      setDisplay('0');
      setEquation('');
      return;
    }
    if (val === '=') {
      try {
        // Simple eval replacement for basic math
        const result = eval(equation.replace(/[^-+*/0-9.]/g, ''));
        setDisplay(String(result));
        setEquation(String(result));
      } catch (e) {
        setDisplay('Error');
      }
      return;
    }
    if (display === '0' || display === 'Error') {
      setDisplay(val);
      setEquation(val);
    } else {
      setDisplay(display + val);
      setEquation(equation + val);
    }
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
    'C'
  ];

  return (
    <div className="max-w-xs mx-auto bg-slate-900 p-6 rounded-3xl shadow-2xl border-4 border-slate-800">
      <div className="bg-slate-800 p-4 rounded-xl mb-4 text-right overflow-hidden">
        <div className="text-slate-500 text-xs h-4 mb-1">{equation}</div>
        <div className="text-white text-3xl font-mono truncate">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => handleInput(btn)}
            className={cn(
              "p-4 rounded-xl font-bold text-lg transition-all active:scale-90",
              btn === '=' ? "bg-brand-500 text-white col-span-1" : 
              btn === 'C' ? "bg-red-500 text-white col-span-4" :
              ['/', '*', '-', '+'].includes(btn) ? "bg-slate-700 text-brand-400" : "bg-slate-800 text-white hover:bg-slate-700"
            )}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}

function UnitConverterTool({ playSound }: { playSound: (type: any) => void }) {
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState('meters');
  const [to, setTo] = useState('feet');
  const [result, setResult] = useState<number>(3.28084);

  const conversions: Record<string, number> = {
    meters: 1,
    feet: 3.28084,
    inches: 39.3701,
    kilometers: 0.001,
    miles: 0.000621371,
    centimeters: 100,
    millimeters: 1000
  };

  const convert = (val: number, f: string, t: string) => {
    const inMeters = val / conversions[f];
    const res = inMeters * conversions[t];
    setResult(res);
  };

  useEffect(() => {
    convert(value, from, to);
  }, [value, from, to]);

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Value</label>
          <input 
            type="number" 
            value={value} 
            onChange={(e) => { setValue(Number(e.target.value)); playSound('click'); }}
            className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">From</label>
            <select 
              value={from} 
              onChange={(e) => { setFrom(e.target.value); playSound('click'); }}
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
            >
              {Object.keys(conversions).map(unit => <option key={unit} value={unit}>{unit}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">To</label>
            <select 
              value={to} 
              onChange={(e) => { setTo(e.target.value); playSound('click'); }}
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
            >
              {Object.keys(conversions).map(unit => <option key={unit} value={unit}>{unit}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="p-8 bg-brand-50 rounded-3xl border-2 border-brand-100 text-center">
        <div className="text-slate-500 text-sm mb-1">Result</div>
        <div className="text-3xl font-black text-brand-600">{result.toFixed(4)} <span className="text-lg font-bold text-brand-400">{to}</span></div>
      </div>
    </div>
  );
}

function PomodoroTimerTool({ playSound }: { playSound: (type: any) => void }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playSound('success');
      setIsActive(false);
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => {
    playSound('click');
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    playSound('pop');
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center space-y-8 max-w-md mx-auto">
      <div className="flex justify-center gap-4">
        <button 
          onClick={() => { setMode('work'); setTimeLeft(25 * 60); setIsActive(false); playSound('click'); }}
          className={cn(
            "px-6 py-2 rounded-full font-bold transition-all",
            mode === 'work' ? "bg-brand-500 text-white shadow-lg" : "bg-slate-100 text-slate-500"
          )}
        >
          Study Time
        </button>
        <button 
          onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); playSound('click'); }}
          className={cn(
            "px-6 py-2 rounded-full font-bold transition-all",
            mode === 'break' ? "bg-brand-500 text-white shadow-lg" : "bg-slate-100 text-slate-500"
          )}
        >
          Short Break
        </button>
      </div>

      <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-100"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={754}
            animate={{ strokeDashoffset: 754 - (754 * timeLeft) / (mode === 'work' ? 25 * 60 : 5 * 60) }}
            className="text-brand-500"
          />
        </svg>
        <div className="text-6xl font-black text-slate-900 font-mono">{formatTime(timeLeft)}</div>
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={toggleTimer}
          className="bg-brand-500 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-brand-600 transition-all shadow-xl shadow-brand-100 active:scale-95"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={resetTimer}
          className="bg-slate-100 text-slate-500 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-slate-200 transition-all active:scale-95"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function ToolsView({ playSound }: { playSound: (type: any) => void }) {
  const [activeTool, setActiveTool] = useState<'calc' | 'unit' | 'pomo' | 'periodic' | 'dict'>('calc');

  const tools = [
    { id: 'calc', name: 'Calculator', icon: CalcIcon, color: 'bg-blue-500' },
    { id: 'unit', name: 'Unit Converter', icon: Ruler, color: 'bg-green-500' },
    { id: 'pomo', name: 'Study Timer', icon: Timer, color: 'bg-red-500' },
    { id: 'periodic', name: 'Periodic Table', icon: FlaskConical, color: 'bg-purple-500' },
    { id: 'dict', name: 'Dictionary', icon: Languages, color: 'bg-amber-500' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2 mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Student <span className="gradient-text">Toolkit</span></h2>
        <p className="text-slate-500 text-lg">Essential tools to power up your study sessions.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => { setActiveTool(tool.id as any); playSound('click'); }}
            className={cn(
              "p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 group",
              activeTool === tool.id 
                ? "border-brand-500 bg-brand-50 shadow-lg shadow-brand-100 scale-105" 
                : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-transform group-hover:rotate-12",
              tool.color
            )}>
              <tool.icon size={24} />
            </div>
            <span className={cn(
              "text-sm font-bold",
              activeTool === tool.id ? "text-brand-600" : "text-slate-500"
            )}>
              {tool.name}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl min-h-[500px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {activeTool === 'calc' && <CalculatorTool playSound={playSound} />}
            {activeTool === 'unit' && <UnitConverterTool playSound={playSound} />}
            {activeTool === 'pomo' && <PomodoroTimerTool playSound={playSound} />}
            {activeTool === 'periodic' && <PeriodicTableTool playSound={playSound} />}
            {activeTool === 'dict' && <DictionaryTool playSound={playSound} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Flashcard({ question, answer, playSound }: { question: string; answer: string; playSound: (type: any) => void }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div 
      className="perspective-1000 h-64 cursor-pointer"
      onClick={() => { setIsFlipped(!isFlipped); playSound('click'); }}
    >
      <motion.div 
        className="relative w-full h-full transition-all duration-500 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white p-8 rounded-3xl border border-slate-200 shadow-lg flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-4">Question</span>
          <p className="text-lg font-bold text-slate-900">{question}</p>
          <p className="text-xs text-slate-400 mt-auto">Click to flip</p>
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 backface-hidden bg-brand-500 p-8 rounded-3xl border border-brand-600 shadow-lg flex flex-col items-center justify-center text-center rotate-y-180 text-white">
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Answer</span>
          <p className="text-lg font-bold">{answer}</p>
          <p className="text-xs text-white/40 mt-auto">Click to flip back</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ExamSessionProps {
  exam: Exam;
  attempt: ExamAttempt;
  onFinish: (answers: Record<string, string>) => void;
  onCancel: () => void;
  onSaveProgress: (attempt: ExamAttempt) => void;
}

function ExamSession({ exam, attempt, onFinish, onCancel, onSaveProgress, playSound }: ExamSessionProps & { playSound: (type: any) => void }) {
  const [currentIdx, setCurrentIdx] = useState(attempt.currentQuestionIndex || 0);
  const [answers, setAnswers] = useState<Record<string, string>>(attempt.answers || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Auto-save progress when answers or index changes
  useEffect(() => {
    onSaveProgress({
      ...attempt,
      answers,
      currentQuestionIndex: currentIdx
    });
  }, [answers, currentIdx]);

  const currentQuestion = exam.questions[currentIdx];
  const progress = ((currentIdx + 1) / exam.questions.length) * 100;
  const allAnswered = exam.questions.every(q => !!answers[q.id]);

  const handleAnswer = (answer: string) => {
    if (currentQuestion.type === 'multi-select') {
      const currentAnswers = answers[currentQuestion.id] ? answers[currentQuestion.id].split(',') : [];
      const newAnswers = currentAnswers.includes(answer)
        ? currentAnswers.filter(a => a !== answer)
        : [...currentAnswers, answer];
      setAnswers({ ...answers, [currentQuestion.id]: newAnswers.join(',') });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: answer });
    }
    playSound('click');
  };

  const next = () => {
    setShowHint(false);
    if (currentIdx < exam.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      playSound('pop');
    } else {
      setIsSubmitting(true);
      onFinish(answers);
    }
  };

  const prev = () => {
    setShowHint(false);
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      playSound('click');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Quit Exam
        </button>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</div>
            <div className="text-sm font-bold text-slate-900">{currentIdx + 1} of {exam.questions.length}</div>
          </div>
          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl min-h-[400px] flex flex-col">
        {/* Question Navigation Bar */}
        <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-slate-50">
          {exam.questions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = idx === currentIdx;
            
            return (
              <button
                key={q.id}
                onClick={() => { setCurrentIdx(idx); playSound('click'); }}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all border-2",
                  isCurrent 
                    ? "border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-100" 
                    : isAnswered 
                      ? "border-brand-100 bg-brand-50 text-brand-600" 
                      : "border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50"
                )}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="mb-8">
          <span className="text-xs font-bold px-2 py-1 bg-brand-50 text-brand-600 rounded-md uppercase tracking-wider mb-4 inline-block">
            {currentQuestion.type.replace('-', ' ')}
          </span>
          <h3 className="text-2xl font-bold text-slate-900 leading-tight">
            {currentQuestion.question}
          </h3>

          {currentQuestion.imageUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
            >
              <img 
                src={currentQuestion.imageUrl} 
                alt="Question visual" 
                className="w-full h-auto max-h-64 object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
          
          <AnimatePresence>
            {showHint && currentQuestion.hint && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm italic flex items-start gap-2"
              >
                <Lightbulb size={16} className="shrink-0 mt-0.5 text-amber-500" />
                <span>{currentQuestion.hint}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4 flex-1">
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className={cn(
                "w-full p-4 text-left rounded-2xl border-2 transition-all flex items-center justify-between group",
                answers[currentQuestion.id] === option 
                  ? "border-brand-500 bg-brand-50 text-brand-700 shadow-md" 
                  : "border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600"
              )}
            >
              <span className="font-medium">{option}</span>
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                answers[currentQuestion.id] === option 
                  ? "border-brand-500 bg-brand-500 text-white" 
                  : "border-slate-200 group-hover:border-slate-300"
              )}>
                {answers[currentQuestion.id] === option && <CheckCircle2 size={14} />}
              </div>
            </button>
          ))}

          {currentQuestion.type === 'multi-select' && currentQuestion.options?.map((option, idx) => {
            const currentAnswers = answers[currentQuestion.id] ? answers[currentQuestion.id].split(',') : [];
            const isSelected = currentAnswers.includes(option);
            
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className={cn(
                  "w-full p-4 text-left rounded-2xl border-2 transition-all flex items-center justify-between group",
                  isSelected 
                    ? "border-brand-500 bg-brand-50 text-brand-700 shadow-md" 
                    : "border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600"
                )}
              >
                <span className="font-medium">{option}</span>
                <div className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                  isSelected 
                    ? "border-brand-500 bg-brand-500 text-white" 
                    : "border-slate-200 group-hover:border-slate-300"
                )}>
                  {isSelected && <CheckCircle2 size={14} />}
                </div>
              </button>
            );
          })}

          {currentQuestion.type === 'true-false' && (
            <div className="grid grid-cols-2 gap-4">
              {['True', 'False'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={cn(
                    "p-8 text-center rounded-2xl border-2 transition-all group",
                    answers[currentQuestion.id] === option 
                      ? "border-brand-500 bg-brand-50 text-brand-700 shadow-md" 
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600"
                  )}
                >
                  <span className="text-xl font-bold block mb-2">{option}</span>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 mx-auto flex items-center justify-center transition-all",
                    answers[currentQuestion.id] === option 
                      ? "border-brand-500 bg-brand-500 text-white" 
                      : "border-slate-200 group-hover:border-slate-300"
                  )}>
                    {answers[currentQuestion.id] === option && <CheckCircle2 size={14} />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={prev}
              disabled={currentIdx === 0}
              className="px-4 py-2 text-slate-500 font-semibold hover:text-slate-900 disabled:opacity-30 transition-all"
            >
              Previous
            </button>
            {currentQuestion.hint && (
              <button 
                onClick={() => { setShowHint(!showHint); playSound('click'); }}
                className={cn(
                  "p-2 rounded-lg transition-all flex items-center gap-2",
                  showHint ? "bg-amber-100 text-amber-600" : "text-slate-400 hover:bg-slate-100"
                )}
                title="Need a hint?"
              >
                <Lightbulb size={20} />
              </button>
            )}
          </div>
          <button 
            onClick={next}
            disabled={!answers[currentQuestion.id] || isSubmitting || (currentIdx === exam.questions.length - 1 && !allAnswered)}
            className="bg-brand-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-100 flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              currentIdx === exam.questions.length - 1 ? 'Finish Exam' : 'Next Question'
            )}
            {!isSubmitting && currentIdx !== exam.questions.length - 1 && <ChevronRight size={20} />}
          </button>
        </div>
        {!allAnswered && currentIdx === exam.questions.length - 1 && (
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-right text-xs text-amber-600 font-bold mt-4"
          >
            * Please answer all questions to finish the exam.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
