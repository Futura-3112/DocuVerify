import React, { useState } from 'react';
import { Mail, RefreshCw, LogOut, Send } from 'lucide-react';
import { sendEmailVerification, User } from 'firebase/auth';
import { motion } from 'framer-motion';

interface VerifyEmailProps {
    user: User;
    onLogout: () => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ user, onLogout }) => {
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState('');

    const handleResend = async () => {
        setSending(true);
        try {
            await sendEmailVerification(user);
            setMessage('Verification email sent! Please check your inbox.');
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/too-many-requests') {
                setMessage('Too many requests. Please wait a moment.');
            } else {
                setMessage('Failed to send email. ' + error.message);
            }
        } finally {
            setSending(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', borderRadius: '1.5rem', textAlign: 'center' }}
            >
                <div style={{
                    width: '80px', height: '80px', background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem', color: 'var(--primary)'
                }}>
                    <Mail size={40} />
                </div>

                <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Verify Your Email</h2>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    We've sent a verification email to <strong>{user.email}</strong>.<br />
                    Please verify your email address to continue.
                </p>

                {message && (
                    <div style={{
                        padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem',
                        background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.9rem'
                    }}>
                        {message}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary"
                        style={{ justifyContent: 'center' }}
                    >
                        <RefreshCw size={18} />
                        I've Verified My Email
                    </button>

                    <button
                        onClick={handleResend}
                        className="btn"
                        disabled={sending}
                        style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}
                    >
                        <Send size={18} />
                        {sending ? 'Sending...' : 'Resend Verification Email'}
                    </button>

                    <button
                        onClick={onLogout}
                        className="btn"
                        style={{ justifyContent: 'center', background: 'transparent', color: 'var(--text-secondary)', marginTop: '0.5rem' }}
                    >
                        <LogOut size={18} />
                        Logout / Use Another Account
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
