import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CrisisModal } from './components/CrisisModal';
import { ProjectSpecsModal } from './components/ProjectSpecsModal';
import { AuthModal } from './components/AuthModal';
import { NightWindDownModal } from './components/NightWindDownModal';
import { ThoughtDissolveModal } from './components/ThoughtDissolveModal';
import { TherapyPrepModal } from './components/TherapyPrepModal';
import { PremiumModal } from './components/PremiumModal';
import { OnboardingView } from './views/OnboardingView';
import { HomeView } from './views/HomeView';
import { CheckInModal } from './views/CheckInModal';
import { CalmView } from './views/CalmView';
import { ChatView } from './views/ChatView';
import { NextStepView } from './views/NextStepView';
import { JournalView } from './views/JournalView';
import { ProgressView } from './views/ProgressView';
import { LibraryView } from './views/LibraryView';
import { PrivacyView } from './views/PrivacyView';
import { MoreView } from './views/MoreView';
import { EntrePlayView } from './views/EntrePlayView';
import { MyCorner } from './components/MyCorner';
import { StorageService } from './services/storage';
import { UserPreferences, MoodCheckIn, NextStepPlan, JournalEntry } from './types';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => StorageService.getPreferences());
  const [checkIns, setCheckIns] = useState<MoodCheckIn[]>(() => StorageService.getCheckIns());
  const [plans, setPlans] = useState<NextStepPlan[]>(() => StorageService.getPlans());
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => StorageService.getJournalEntries());

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Advanced feature modals
  const [isNightWindDownOpen, setIsNightWindDownOpen] = useState(false);
  const [isThoughtDissolveOpen, setIsThoughtDissolveOpen] = useState(false);
  const [isTherapyPrepOpen, setIsTherapyPrepOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  // Sync preferences whenever updated
  const handleUpdatePreferences = (updated: UserPreferences) => {
    setPreferences(updated);
    StorageService.savePreferences(updated);
  };

  const handleCompleteOnboarding = (updated: UserPreferences) => {
    setPreferences(updated);
    StorageService.savePreferences(updated);
    if (checkIns.length === 0) {
      StorageService.loadDemoData();
      setCheckIns(StorageService.getCheckIns());
      setPlans(StorageService.getPlans());
      setJournalEntries(StorageService.getJournalEntries());
    }
  };

  const handleSaveCheckIn = (newCheckIn: MoodCheckIn) => {
    const updated = StorageService.saveCheckIn(newCheckIn);
    setCheckIns(updated);
  };

  const handleSavePlan = (newPlan: NextStepPlan) => {
    const updated = StorageService.savePlan(newPlan);
    setPlans(updated);
  };

  const handleTogglePlanCompletion = (plan: NextStepPlan) => {
    const updated = StorageService.savePlan({
      ...plan,
      completed: !plan.completed,
    });
    setPlans(updated);
  };

  const handleDeletePlan = (id: string) => {
    const updated = StorageService.deletePlan(id);
    setPlans(updated);
  };

  const handleSaveJournal = (entry: JournalEntry) => {
    const updated = StorageService.saveJournalEntry(entry);
    setJournalEntries(updated);
  };

  const handleDeleteJournal = (id: string) => {
    const updated = StorageService.deleteJournalEntry(id);
    setJournalEntries(updated);
  };

  const handleDataReset = () => {
    setCheckIns([]);
    setPlans([]);
    setJournalEntries([]);
    const defaultPrefs = StorageService.getPreferences();
    setPreferences(defaultPrefs);
  };

  const handleReloadDemo = () => {
    StorageService.loadDemoData();
    setCheckIns(StorageService.getCheckIns());
    setPlans(StorageService.getPlans());
    setJournalEntries(StorageService.getJournalEntries());
  };

  const handleDataImported = () => {
    setPreferences(StorageService.getPreferences());
    setCheckIns(StorageService.getCheckIns());
    setPlans(StorageService.getPlans());
    setJournalEntries(StorageService.getJournalEntries());
  };

  // Find today's checkin and plan
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckIn = checkIns.find(c => c.date === todayStr);
  const todayPlan = plans.find(p => p.date === todayStr);

  // If user hasn't completed onboarding, show onboarding first
  if (!preferences.onboardingCompleted) {
    return (
      <OnboardingView
        initialPreferences={preferences}
        onComplete={handleCompleteOnboarding}
      />
    );
  }

  const isSubView = ['progress', 'library', 'privacy', 'corner'].includes(currentTab);

  return (
    <div className={`min-h-screen bg-[#070D12] text-slate-100 flex flex-col font-sans transition-colors ${
      preferences.lowStimulusMode ? 'low-stimulus' : ''
    } ${preferences.reduceMotion ? 'reduce-motion' : ''}`}>
      {/* Top Navigation */}
      <Navbar
        onOpenCrisis={() => setIsCrisisOpen(true)}
        onOpenSpecs={() => setIsSpecsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenPremium={() => setIsPremiumOpen(true)}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        currentTab={currentTab}
        onNavigate={setCurrentTab}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 pb-24">
        {/* Back navigation for subviews inside 'More' */}
        {isSubView && currentTab !== 'corner' && (
          <div className="mb-4">
            <button
              onClick={() => setCurrentTab('more')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-900 border border-slate-800/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para Mais Recursos</span>
            </button>
          </div>
        )}

        {/* Dynamic View Rendering */}
        {currentTab === 'home' && (
          <HomeView
            preferences={preferences}
            onNavigate={setCurrentTab}
            onOpenCheckIn={() => setIsCheckInOpen(true)}
            onOpenCrisis={() => setIsCrisisOpen(true)}
            onOpenNightWindDown={() => setIsNightWindDownOpen(true)}
            onOpenThoughtDissolve={() => setIsThoughtDissolveOpen(true)}
            onOpenTherapyPrep={() => setIsTherapyPrepOpen(true)}
            todayCheckIn={todayCheckIn}
            todayPlan={todayPlan}
            onTogglePlanCompletion={handleTogglePlanCompletion}
          />
        )}

        {currentTab === 'calm' && (
          <CalmView
            preferences={preferences}
            onNavigate={setCurrentTab}
            onSavePlan={handleSavePlan}
          />
        )}

        {currentTab === 'chat' && (
          <ChatView
            preferences={preferences}
            onOpenCrisis={() => setIsCrisisOpen(true)}
            onSavePlan={handleSavePlan}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'next-step' && (
          <NextStepView
            plans={plans}
            onSavePlan={handleSavePlan}
            onTogglePlanCompletion={handleTogglePlanCompletion}
            onDeletePlan={handleDeletePlan}
            preferences={preferences}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'journal' && (
          <JournalView
            entries={journalEntries}
            onSaveEntry={handleSaveJournal}
            onDeleteEntry={handleDeleteJournal}
            pinLockEnabled={preferences.account?.pinLockEnabled}
            pinCode={preferences.account?.pinCode}
          />
        )}

        {currentTab === 'more' && (
          <MoreView
            onNavigateSub={setCurrentTab}
            onOpenCrisis={() => setIsCrisisOpen(true)}
            onOpenSpecs={() => setIsSpecsOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenNightWindDown={() => setIsNightWindDownOpen(true)}
            onOpenThoughtDissolve={() => setIsThoughtDissolveOpen(true)}
            onOpenTherapyPrep={() => setIsTherapyPrepOpen(true)}
            onRestartOnboarding={() => {
              handleUpdatePreferences({
                ...preferences,
                onboardingCompleted: false,
              });
            }}
            preferences={preferences}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressView
            checkIns={checkIns}
            plans={plans}
            journalEntries={journalEntries}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'library' && (
          <LibraryView />
        )}

        {currentTab === 'privacy' && (
          <PrivacyView
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            checkIns={checkIns}
            plans={plans}
            journalEntries={journalEntries}
            onDataReset={handleDataReset}
            onReloadDemo={handleReloadDemo}
            onDataImported={handleDataImported}
          />
        )}

        {currentTab === 'entreplay' && (
          <EntrePlayView onNavigate={setCurrentTab} />
        )}

        {currentTab === 'corner' && (
          <MyCorner onBack={() => setCurrentTab('more')} />
        )}
      </main>

      {/* Persistent Bottom Tab Navigation */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={setCurrentTab}
      />

      {/* Modal: Check-In */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSave={handleSaveCheckIn}
        existingCheckIn={todayCheckIn}
      />

      {/* Modal: Crisis & Emergency (Triggered anytime via top bar or chat) */}
      <CrisisModal
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
        preferences={preferences}
        onUpdateCountry={(c) => handleUpdatePreferences({ ...preferences, selectedCountry: c })}
      />

      {/* Modal: Project Specs, Ethics Manifesto & Architecture */}
      <ProjectSpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

      {/* Modal: User Login & Profile Panel */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
      />

      {/* Modal: Desaceleração Noturna & Sono */}
      <NightWindDownModal
        isOpen={isNightWindDownOpen}
        onClose={() => setIsNightWindDownOpen(false)}
        onSaveStep={(action, reflection) => {
          handleSavePlan({
            id: `plan-${Date.now()}`,
            date: todayStr,
            priority: 'Descanso e sono tranquilo',
            smallAction: action,
            smallActionMinutes: 5,
            completed: false,
            createdAt: new Date().toISOString(),
          });
          if (reflection) {
            handleSaveJournal({
              id: `journal-${Date.now()}`,
              timestamp: new Date().toISOString(),
              date: todayStr,
              title: 'Reflexão da Noite: Soltar o Dia',
              promptUsed: 'O que você escolhe deixar para trás esta noite?',
              content: reflection,
              tags: ['Desaceleração Noturna', 'Sono'],
            });
          }
        }}
      />

      {/* Modal: Dissolver Pensamento Pesado */}
      <ThoughtDissolveModal
        isOpen={isThoughtDissolveOpen}
        onClose={() => setIsThoughtDissolveOpen(false)}
      />

      {/* Modal: Preparação para Consulta / Terapia */}
      <TherapyPrepModal
        isOpen={isTherapyPrepOpen}
        onClose={() => setIsTherapyPrepOpen(false)}
        checkIns={checkIns}
        journalEntries={journalEntries}
        preferences={preferences}
      />

      {/* Modal: Amparo Premium */}
      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
      />
    </div>
  );
}
