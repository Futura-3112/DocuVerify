import { useState, useEffect } from 'react';
import { Search, FileText, CheckCircle, AlertCircle, ChevronDown, CheckSquare, Loader2, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';
import Login from './Login';
import './index.css';

const API_BASE_URL = 'http://localhost:5200/api';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [metaData, setMetaData] = useState({ states: [], ageCategories: [], processes: [] });
  const [searchParams, setSearchParams] = useState({
    processId: '',
    ageCategoryId: '',
    stateId: ''
  });
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

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
        } catch (err) {
          console.error("Failed to sync user with backend", err);
        }
      }

      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Metadata when user is authenticated
  useEffect(() => {
    if (user) {
      fetchMetaData();
    }
  }, [user]);

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
    } catch (err) {
      console.error(err);
      setError('Could not load application data. Is the API running?');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchParams.processId || !searchParams.ageCategoryId) {
      alert('Please select at least a Process and Age Category.');
      return;
    }

    setSearching(true);
    setResults(null);

    const query = new URLSearchParams({
      processId: searchParams.processId,
      ageCategoryId: searchParams.ageCategoryId,
      ...(searchParams.stateId && { stateId: searchParams.stateId })
    });

    try {
      const response = await fetch(`${API_BASE_URL}/search?${query}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data.documents || []);
    } catch (err) {
      console.error(err);
      alert('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setResults(null);
      setSearchParams({ processId: '', ageCategoryId: '', stateId: '' });
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
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

  // If logged in but fetching initial data
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  const isGuest = user.isAnonymous;

  return (
    <div className="app-container">
      {/* Navbar / Header */}
      <nav className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={28} color="var(--primary)" />
            <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
              DocuVerify
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <User size={16} />
              <span>{isGuest ? 'Guest' : user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', padding: '0.5rem 1rem', fontSize: '0.9rem', gap: '0.5rem' }}
            >
              <LogOut size={16} />
              {isGuest ? 'Exit Guest' : 'Logout'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container" style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Hero Section */}
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

        {/* Search Card */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ width: '100%', maxWidth: '900px', padding: '2rem', borderRadius: '1.5rem', marginBottom: '3rem' }}
        >
          <form onSubmit={handleSearch} className="grid-cols-3">
            <div className="input-group">
              <label className="label">Process Type</label>
              <div style={{ position: 'relative' }}>
                <select
                  className="select"
                  value={searchParams.processId}
                  onChange={(e) => setSearchParams({ ...searchParams, processId: e.target.value })}
                  required
                >
                  <option value="">Select Process...</option>
                  {metaData.processes.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            <div className="input-group">
              <label className="label">Age Category</label>
              <div style={{ position: 'relative' }}>
                <select
                  className="select"
                  value={searchParams.ageCategoryId}
                  onChange={(e) => setSearchParams({ ...searchParams, ageCategoryId: e.target.value })}
                  required
                >
                  <option value="">Select Age Group...</option>
                  {metaData.ageCategories.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.minAge}-{a.maxAge})</option>
                  ))}
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            <div className="input-group">
              <label className="label">State (Optional)</label>
              <div style={{ position: 'relative' }}>
                <select
                  className="select"
                  value={searchParams.stateId}
                  onChange={(e) => setSearchParams({ ...searchParams, stateId: e.target.value })}
                >
                  <option value="">All India / Default</option>
                  {metaData.states.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            <div className="input-group" style={{ display: 'flex', alignItems: 'flex-end', paddingTop: '1.4rem' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={searching}>
                {searching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} style={{ marginRight: '0.5rem' }} />}
                {searching ? 'Finding...' : 'Find Documents'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Results Section */}
        <div style={{ width: '100%', maxWidth: '900px', paddingBottom: '4rem' }}>
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem' }}>Required Documents <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 400 }}>({results.length} found)</span></h2>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  {results.length === 0 ? (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                      <p>No specific documents found for this criteria.</p>
                    </div>
                  ) : (
                    results.map((doc, index) => (
                      <motion.div
                        key={doc.documentId || index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass"
                        style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}
                      >
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '0.75rem', color: 'var(--primary)' }}>
                          <CheckSquare size={24} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{doc.documentName}</h3>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            {doc.stepDescription || 'Mandatory document for verification.'}
                          </p>
                          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', color: 'var(--text-secondary)' }}>
                              Priority: {doc.sortOrder !== undefined ? doc.sortOrder : 'Normal'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass"
              style={{ borderLeft: '4px solid #ef4444', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}
            >
              <AlertCircle color="#ef4444" />
              <p style={{ color: '#ef4444' }}>{error}</p>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
