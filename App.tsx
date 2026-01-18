
import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { FarmSelectionScreen } from './components/FarmSelectionScreen';
import { FeedEntryScreen } from './components/FeedEntryScreen';
import { MortalityEntryScreen } from './components/MortalityEntryScreen';
import { ExpenseEntryScreen } from './components/ExpenseEntryScreen';
import { AppScreen } from './types';
import { Layout } from './components/Layout';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.WELCOME);
  const [session, setSession] = useState<any>(null);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkRegistrationStatus(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkRegistrationStatus(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkRegistrationStatus = async (userId: string) => {
    setIsCheckingProfile(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        setCurrentScreen(AppScreen.REGISTRATION);
      } else {
        // Already registered
        if (currentScreen === AppScreen.AUTH || currentScreen === AppScreen.WELCOME || currentScreen === AppScreen.REGISTRATION) {
          setCurrentScreen(AppScreen.FARM_SELECTION);
        }
      }
    } catch (e) {
      setCurrentScreen(AppScreen.REGISTRATION);
    } finally {
      setIsCheckingProfile(false);
    }
  };

  const handleStart = () => {
    if (session) {
      checkRegistrationStatus(session.user.id);
    } else {
      setCurrentScreen(AppScreen.AUTH);
    }
  };

  const handleAuthSuccess = () => {
    if (session) {
      checkRegistrationStatus(session.user.id);
    } else {
      // Small delay to let session update if needed
      setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) checkRegistrationStatus(session.user.id);
        });
      }, 500);
    }
  };

  const handleRegistrationSuccess = () => {
    setCurrentScreen(AppScreen.FARM_SELECTION);
  };

  const handleFarmSelect = (farmId: string) => {
    setSelectedFarmId(farmId);
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  const renderScreen = () => {
    if (isCheckingProfile) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">Checking profile...</p>
        </div>
      );
    }

    switch (currentScreen) {
      case AppScreen.WELCOME:
        return <WelcomeScreen onStart={handleStart} />;
      case AppScreen.AUTH:
        return <AuthScreen onSuccess={handleAuthSuccess} />;
      case AppScreen.REGISTRATION:
        return <RegistrationScreen onSuccess={handleRegistrationSuccess} />;
      case AppScreen.FARM_SELECTION:
        return <FarmSelectionScreen onSelect={handleFarmSelect} />;
      case AppScreen.FEED_ENTRY:
        return (
          <FeedEntryScreen 
            farmId={selectedFarmId!} 
            onBack={() => setCurrentScreen(AppScreen.DASHBOARD)}
            onSuccess={() => setCurrentScreen(AppScreen.DASHBOARD)}
          />
        );
      case AppScreen.MORTALITY_ENTRY:
        return (
          <MortalityEntryScreen 
            farmId={selectedFarmId!} 
            onBack={() => setCurrentScreen(AppScreen.DASHBOARD)}
            onSuccess={() => setCurrentScreen(AppScreen.DASHBOARD)}
          />
        );
      case AppScreen.EXPENSE_ENTRY:
        return (
          <ExpenseEntryScreen 
            farmId={selectedFarmId!} 
            onBack={() => setCurrentScreen(AppScreen.DASHBOARD)}
            onSuccess={() => setCurrentScreen(AppScreen.DASHBOARD)}
          />
        );
      case AppScreen.DASHBOARD:
        return (
          <div className="p-6">
            <div className="flex flex-col gap-4 mb-8">
              <h1 className="text-2xl font-bold text-slate-800">Dashboard (डैशबोर्ड)</h1>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setCurrentScreen(AppScreen.FEED_ENTRY)}
                  className="bg-orange-500 text-white p-4 rounded-2xl text-center font-bold shadow-sm flex flex-col items-center gap-2 transform active:scale-95 transition-all"
                >
                  <span className="text-2xl">🌾</span>
                  <span className="text-xs">Feed Entry<br/>चारा एंट्री</span>
                </button>
                <button 
                  onClick={() => setCurrentScreen(AppScreen.MORTALITY_ENTRY)}
                  className="bg-red-500 text-white p-4 rounded-2xl text-center font-bold shadow-sm flex flex-col items-center gap-2 transform active:scale-95 transition-all"
                >
                  <span className="text-2xl">💀</span>
                  <span className="text-xs">Mortality<br/>मृत्यु दर</span>
                </button>
                <button 
                  onClick={() => setCurrentScreen(AppScreen.EXPENSE_ENTRY)}
                  className="bg-blue-500 text-white p-4 rounded-2xl text-center font-bold shadow-sm flex flex-col items-center gap-2 transform active:scale-95 transition-all col-span-2"
                >
                  <span className="text-2xl">💸</span>
                  <span className="text-xs">Expense Entry<br/>खर्च एंट्री</span>
                </button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="font-bold text-slate-800 mb-2">Farm Info</h2>
              <p className="text-slate-600 text-sm">
                Active Farm ID: <span className="font-mono text-orange-600 font-medium">{selectedFarmId}</span>
              </p>
              <button 
                onClick={() => setCurrentScreen(AppScreen.FARM_SELECTION)}
                className="mt-4 text-orange-500 text-sm font-bold"
              >
                Change Farm / फार्म बदलें
              </button>
            </div>
          </div>
        );
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  const hideLayout = [AppScreen.WELCOME, AppScreen.AUTH, AppScreen.REGISTRATION, AppScreen.FARM_SELECTION].includes(currentScreen);

  if (hideLayout) {
    return renderScreen();
  }

  return (
    <Layout currentScreen={currentScreen} onNavigate={setCurrentScreen}>
      {renderScreen()}
    </Layout>
  );
};

export default App;
