import { FileText, LogOut, User } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
    user: FirebaseUser | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    const isGuest = user?.isAnonymous;

    return (
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
                        <span>{isGuest ? 'Guest' : user?.email}</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="btn"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', padding: '0.5rem 1rem', fontSize: '0.9rem', gap: '0.5rem' }}
                    >
                        <LogOut size={16} />
                        {isGuest ? 'Exit Guest' : 'Logout'}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Header;
