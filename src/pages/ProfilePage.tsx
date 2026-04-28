import { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { UserProfile } from '../types';
import { LogOut, MapPin, Phone, ShoppingBag, Clock, ChevronRight, User as UserIcon } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { doc, setDoc } from 'firebase/firestore';

export default function ProfilePage({ user, profile, onAuthClick }: { user: any, profile: UserProfile | null, onAuthClick: () => void }) {
  if (!user) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="bg-gray-100 p-8 rounded-full">
          <UserIcon size={64} className="text-gray-300" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Karibu akaunti yako</h2>
          <p className="text-gray-500 text-sm max-w-[250px] mx-auto">
            Ingia ili uone historia ya oda zako na ufuatilie subscription yako.
          </p>
        </div>
        <button 
          onClick={onAuthClick}
          className="w-full max-w-xs bg-black text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95"
        >
          Ingia Sasa
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Profile Header */}
      <div className="flex items-center gap-5 border-b-4 border-black pb-8">
        <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center text-gold text-3xl font-black border-4 border-gold uppercase shadow-lg shadow-gold/20">
          {profile?.displayName?.[0] || user.email?.[0] || 'U'}
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">{profile?.displayName || 'Mtumiaji'}</h2>
          <div className="flex items-center gap-2 text-[10px] text-black font-black bg-gold px-3 py-1 rounded-full w-fit uppercase tracking-wider">
            <Phone size={12} /> {profile?.phoneNumber || 'Sajili namba'}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border-2 border-black p-5 rounded-3xl space-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Points</span>
          <p className="text-2xl font-black text-gold">{profile?.points || 0}</p>
        </div>
        <div className="bg-black border-2 border-black p-5 rounded-3xl space-y-1 shadow-[4px_4px_0px_0px_rgba(212,175,55,0.2)]">
          <span className="text-[10px] uppercase font-black text-gold/60 tracking-widest">Subscription</span>
          <p className="text-[11px] font-black text-white uppercase truncate tracking-tighter">Fresh Student</p>
        </div>
      </div>

      {/* Settings Options */}
      <div className="space-y-3">
        <ProfileOption icon={<MapPin size={18} />} label="Eneo la Delivery" value={profile?.location || 'Dodoma Campus'} />
        <ProfileOption icon={<Clock size={18} />} label="Historia ya Oda" value="Tazama zote" />
      </div>

      {/* Logout */}
      <button 
        onClick={() => signOut(auth)}
        className="w-full flex items-center justify-center gap-3 text-red-500 font-black uppercase tracking-widest py-5 border-2 border-red-500 rounded-[24px] hover:bg-red-50 transition-all active:scale-95"
      >
        <LogOut size={18} /> Toka
      </button>
    </div>
  );
}

function ProfileOption({ icon, label, value }: any) {
  return (
    <div className="bg-white border-2 border-black/10 p-5 rounded-3xl flex items-center justify-between hover:border-black transition-colors">
      <div className="flex items-center gap-4">
        <div className="bg-gray-100 p-2.5 rounded-xl border border-black/5 text-black">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
          <p className="text-xs font-black uppercase tracking-tighter">{value}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-black/20" />
    </div>
  );
}
