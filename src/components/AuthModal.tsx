import { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { X, Mail, Chrome, Phone } from 'lucide-react';
import { motion } from 'motion/react';

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'options' | 'phone'>('options');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Initialize profile if not exists
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          displayName: user.displayName || 'Mtumiaji',
          phoneNumber: '',
          location: '',
          isAdmin: false,
          points: 50, // Welcome points
        });
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="relative w-full max-w-md bg-white rounded-t-[48px] sm:rounded-[48px] p-10 space-y-8 overflow-hidden border-t-8 sm:border-8 border-black shadow-2xl"
      >
        <button onClick={onClose} className="absolute right-8 top-8 p-2 bg-black text-white rounded-full border-2 border-black active:scale-90 transition-all">
          <X size={20} />
        </button>

        <div className="space-y-3 text-center pt-4">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            Ingia <span className="text-gold underline underline-offset-8 decoration-4">UniPlug</span>
          </h2>
          <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest pt-2">Pata harufu nzuri, ukiwa mwanafunzi janja.</p>
        </div>

        {method === 'options' ? (
          <div className="space-y-4 pt-4">
            <AuthButton 
              onClick={handleGoogleLogin} 
              icon={<Chrome size={20} />} 
              label="Ingia na Google" 
              loading={loading}
              variant="solid"
            />
            <AuthButton 
              onClick={() => setMethod('phone')} 
              icon={<Phone size={20} />} 
              label="Ingia na Simu" 
              variant="outline"
            />
            <p className="text-[9px] text-center text-gray-400 pt-6 font-black uppercase tracking-widest leading-relaxed">
              Kwa kuingia, unakubali Vigezo na Masharti <br/> yetu ya UniPlug Perfumes.
            </p>
          </div>
        ) : (
          <div className="space-y-6 pt-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Namba ya Simu</label>
                <input 
                  type="tel" 
                  placeholder="07XX XXX XXX" 
                  className="w-full bg-white border-2 border-black p-5 rounded-2xl outline-none focus:ring-0 font-black uppercase tracking-widest placeholder:text-gray-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
             </div>
             <button className="w-full bg-black text-gold font-black uppercase tracking-widest py-5 rounded-[24px] shadow-[6px_6px_0px_0px_rgba(212,175,55,0.2)] active:scale-95 transition-all text-sm">
               Tuma Kode ya OTP
             </button>
             <button onClick={() => setMethod('options')} className="w-full text-[10px] font-black text-black uppercase tracking-widest underline decoration-2 underline-offset-4">Rudi Nyuma</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function AuthButton({ onClick, icon, label, variant = 'solid', loading }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-4 py-5 rounded-[24px] font-black uppercase tracking-widest transition-all active:scale-95 text-xs border-2 ${
        variant === 'solid' ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]' : 'bg-white text-black border-black/10'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : icon}
      {label}
    </button>
  );
}
