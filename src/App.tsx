/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Home, ShoppingBag, Calendar, User as UserIcon, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import SubscriptionPage from './pages/SubscriptionPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AuthModal from './components/AuthModal';
import { UserProfile } from './types';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

type Tab = 'home' | 'catalog' | 'subscriptions' | 'profile' | 'admin';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile({ uid: u.uid, ...docSnap.data() } as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage onNavigate={setActiveTab} />;
      case 'catalog': return <CatalogPage />;
      case 'subscriptions': return <SubscriptionPage />;
      case 'profile': return <ProfilePage user={user} profile={profile} onAuthClick={() => setShowAuthModal(true)} />;
      case 'admin': return <AdminPage />;
      default: return <HomePage onNavigate={setActiveTab} />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-black font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b-4 border-black p-4 sticky top-0 z-50 flex justify-between items-center px-6">
        <div>
          <h1 className="text-2xl font-black tracking-tighter leading-none">UNIPLUG</h1>
          <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Dodoma, TZ</p>
        </div>
        <div className="flex gap-2">
          {profile?.isAdmin && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center transition-colors ${activeTab === 'admin' ? 'bg-gold' : 'bg-white'}`}
            >
              <Settings size={18} />
            </button>
          )}
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center transition-colors ${activeTab === 'profile' ? 'bg-gold' : 'bg-white'}`}
          >
            <UserIcon size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black z-50">
        <div className="max-w-lg mx-auto flex justify-around p-4">
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<Home size={22} />} 
            label="Mwanzo" 
          />
          <NavButton 
            active={activeTab === 'catalog'} 
            onClick={() => setActiveTab('catalog')} 
            icon={<ShoppingBag size={22} />} 
            label="Katalogi" 
          />
          <NavButton 
            active={activeTab === 'subscriptions'} 
            onClick={() => setActiveTab('subscriptions')} 
            icon={<Calendar size={22} />} 
            label="Huduma" 
          />
        </div>
        <div className="h-2 w-32 bg-black/10 rounded-full mx-auto mb-2" />
      </nav>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-black scale-110' : 'text-gray-400'}`}
    >
      <div className={cn(
        "p-1 transition-all",
        active ? "text-gold" : "text-gray-400"
      )}>
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-dot" 
          className="w-1 h-1 bg-black rounded-full" 
        />
      )}
    </button>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

