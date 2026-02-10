import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { onAuthStateChanged, signOut, signInAnonymously, User } from 'firebase/auth';
import { auth } from './config/firebase';
import Login from './components/auth/Login';
import VerifyEmail from './components/auth/VerifyEmail';
import Header from './components/common/Header';
import SearchForm from './components/search/SearchForm';
import ResultsList from './components/results/ResultsList';
import { MetaData, DocumentResult, SearchParams } from './types';
import './index.css';

const API_BASE_URL = 'http://localhost:5200/api';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false); // Initially false until we fetch data
  const [metaData, setMetaData] = useState<MetaData>({ states: [], ageCategories: [], processes: [] });
  const [results, setResults] = useState<DocumentResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Monitor Auth State and Sync with Backend
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Sync user with backend
        try {
          await fetch(`${API_BASE_URL}/auth/sync-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firebaseUid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              isAnonymous: currentUser.isAnonymous
            })
          });

          await fetchMetaData(); // Fetch data after login
        } catch (err) {
          console.error("Failed to sync user or fetch data", err);
          setError('Failed to connect to backend.');
        }
      }

      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchMetaData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/sync`);
      if (!response.ok) throw new Error('Failed to load configuration');
      const data = await response.json();
      setMetaData({
        states: data.states || [],
        ageCategories: data.ageCategories || [],
        processes: data.processes || []
      });
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Could not load application data. Is the API running?');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (params: SearchParams) => {
    if (!params.processId || !params.ageCategoryId) {
      alert('Please select at least a Process and Age Category.');
      return;
    }

    setSearching(true);
    setResults(null);
    setError(null);

    const query = new URLSearchParams({
      processId: params.processId,
      ageCategoryId: params.ageCategoryId,
      ...(params.stateId && { stateId: params.stateId })
    });

    try {
      const response = await fetch(`${API_BASE_URL}/search?${query}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data.documents || []);
    } catch (err) {
      console.error(err);
      setError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setResults(null);
      // Reset search params is handled by SearchForm component's own state, 
      // or we can lift it up if we want to clear it on logout.
      // For now, logout just clears usage context.
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      console.error("Error signing in anonymously:", error);
      if (error.code === 'auth/operation-not-allowed') {
        alert("Guest login is disabled. Please enable 'Anonymous' sign-in provider in your Firebase Console.");
      } else {
        alert("Could not start guest session. " + error.message);
      }
    }
  };

  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  // If not logged in, show Login Screen
  if (!user) {
    return <Login onGuestContinue={handleGuestLogin} />;
  }

  // If logged in but email not verified (and not a guest), show Verify Email Screen
  if (!user.isAnonymous && !user.emailVerified) {
    return <VerifyEmail user={user} onLogout={handleLogout} />;
  }

  // If logged in but fetching initial data
  if (loading && !metaData.processes.length) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header user={user} onLogout={handleLogout} />

      <main className="container" style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '3rem' }}
        >
          <h1>Verify Requirements instantly.</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Select your process and details to get an instant list of required documents tailored to your state regulations.
          </p>
        </motion.div>

        <SearchForm
          metaData={metaData}
          onSearch={handleSearch}
          searching={searching}
        />

        <ResultsList results={results} error={error} />
      </main>
    </div>
  );
}

export default App;
