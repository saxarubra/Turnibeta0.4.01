import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { PasswordResetForm } from './components/auth/PasswordResetForm';
import { MatrixUploader } from './components/shifts/MatrixUploader';
import { LogOut, User, RefreshCw, ArrowLeftRight, Mail, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import Notifications from './components/Notifications';
import { AdminSetup } from './components/admin/AdminSetup';
import { EmailTest } from './components/EmailTest';
import ShiftList from './components/shifts/ShiftList';
import { SwapsPage } from './components/shifts/SwapsPage';
import EmailPage from './pages/EmailPage';

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSwapsPage, setShowSwapsPage] = useState(false);
  const [showEmailTest, setShowEmailTest] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (user) {
      loadLatestSchedule();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (supabaseError) {
        throw supabaseError;
      }

      setIsAdmin(data?.role === 'admin' || false);
    } catch (err: any) {
      console.error('Error checking admin status:', err);
      setError(err.message);
      setIsAdmin(false);
    }
  };

  const loadLatestSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('shifts_schedule')
        .select('week_start_date')
        .order('week_start_date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        setCurrentWeekStart(data.week_start_date);
        setShowMatrix(true);
      }
    } catch (err) {
      console.error('Error loading latest schedule:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-8">
          {showPasswordReset ? (
            <PasswordResetForm onBack={() => setShowPasswordReset(false)} />
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">Welcome</h2>
              <div className="space-y-6">
                <LoginForm onForgotPassword={() => setShowPasswordReset(true)} />
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign up</span>
                  </div>
                </div>
                <SignUpForm />
              </div>
            </>
          )}
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Email Test</h2>
          <EmailTest />
        </div>
      </div>
    );
  }

  const handleUploadSuccess = (date: string) => {
    setCurrentWeekStart(date);
    setShowMatrix(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo o titolo */}
            </div>
            <div className="flex items-center">
              <Notifications />
              {/* Altri elementi della navbar */}
            </div>
          </div>
        </div>
      </nav>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Shift Management</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSwapsPage(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <ArrowLeftRight className="h-4 w-4" />
                <span>Scambi Turno</span>
              </button>
              <div className="flex items-center space-x-2 px-3 py-2 bg-indigo-50 rounded-md">
                <User className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-medium text-indigo-700">{user.name}</span>
              </div>
              {isAdmin && (
                <>
                  <button
                    onClick={() => setShowEmailTest(true)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Test Email</span>
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('Sei sicuro di voler resettare il database? Questa azione cancellerà tutti i turni, gli scambi e le notifiche.')) {
                        return;
                      }
                      try {
                        console.log('Iniziando il reset del database...');
                        console.log('User ID:', user?.id);
                        console.log('Is Admin:', isAdmin);

                        // Cancella tutti i dati dalla tabella shifts_schedule
                        const { error: shiftsError } = await supabase
                          .from('shifts_schedule')
                          .delete()
                          .neq('id', '00000000-0000-0000-0000-000000000000');

                        console.log('Risultato delete shifts:', { error: shiftsError });
                        if (shiftsError) throw shiftsError;

                        // Cancella tutti i dati dalla tabella shift_swaps
                        const { error: swapsError } = await supabase
                          .from('shift_swaps')
                          .delete()
                          .neq('id', '00000000-0000-0000-0000-000000000000');

                        console.log('Risultato delete swaps:', { error: swapsError });
                        if (swapsError) throw swapsError;

                        // Cancella tutti i dati dalla tabella notifications
                        const { error: notificationsError } = await supabase
                          .from('notifications')
                          .delete()
                          .neq('id', '00000000-0000-0000-0000-000000000000');

                        console.log('Risultato delete notifications:', { error: notificationsError });
                        if (notificationsError) throw notificationsError;

                        alert('Database resettato con successo!');
                      } catch (err) {
                        console.error('Errore durante il reset del database:', err);
                        alert('Errore durante il reset del database. Controlla la console per i dettagli.');
                      }
                    }}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Reset Database</span>
                  </button>
                </>
              )}
              <button
                onClick={signOut}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {showSwapsPage ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestione Scambi Turno</h2>
              <button
                onClick={() => setShowSwapsPage(false)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                <X className="h-4 w-4" />
                <span>Chiudi</span>
              </button>
            </div>
            <SwapsPage />
          </div>
        ) : showEmailTest ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Test Email</h2>
              <button
                onClick={() => setShowEmailTest(false)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                <X className="h-4 w-4" />
                <span>Chiudi</span>
              </button>
            </div>
            <EmailTest />
          </div>
        ) : showMatrix ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestione Turni</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowMatrix(false)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Carica Nuova Matrice</span>
                </button>
              )}
            </div>
            <ShiftList weekStartDate={currentWeekStart} />
          </div>
        ) : isAdmin ? (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Carica Matrice Turni</h2>
            <MatrixUploader onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : null}
      </main>
    </div>
  );
}