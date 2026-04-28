import { useState } from 'react';
import { Package, Calendar, Zap, CreditCard, ChevronRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { formatPrice } from '../lib/utils';

export default function SubscriptionPage() {
  const [view, setView] = useState<'plans' | 'refill'>('plans');

  return (
    <div className="p-6 space-y-6">
      <div className="flex p-1 bg-black rounded-2xl border-2 border-black">
        <button 
          onClick={() => setView('plans')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'plans' ? 'bg-gold text-black' : 'text-gray-400'}`}
        >
          Mipango
        </button>
        <button 
          onClick={() => setView('refill')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'refill' ? 'bg-gold text-black' : 'text-gray-400'}`}
        >
          Refill
        </button>
      </div>

      {view === 'plans' ? (
        <div className="space-y-6">
          <h2 className="text-3xl font-black italic tracking-tighter text-black uppercase">Mipango</h2>
          
          <SubscriptionCard 
            id="fresh-student"
            title="Fresh Student"
            price={10000}
            features={["10ml Kila Mwezi", "Same-day Delivery", "Free Gift Samples"]}
            color="bg-white border-black"
          />
          <SubscriptionCard 
            id="active-campus"
            title="Active Campus"
            price={20000}
            features={["20ml Kila Mwezi", "Harufu Maalum", "Priority Delivery"]}
            color="bg-black text-white border-black"
            highlight={true}
          />
          <SubscriptionCard 
            id="elite-uniplug"
            title="Elite UniPlug"
            price={35000}
            features={["30ml Kila Mwezi", "Limited Edition Scents", "Free Delivery"]}
            color="bg-[#F3F3F3] border-black/10"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-black rounded-[40px] p-8 text-white space-y-4 text-center border-4 border-black">
             <div className="bg-gold/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto border-2 border-gold/40">
               <RefreshCw className="text-gold" size={32} />
             </div>
             <h2 className="text-3xl font-black italic">Refill ya Haraka</h2>
             <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Chupa yako imeisha? <br/> Tuko hapa kukujaza tena.</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-black italic text-xl border-b-2 border-black pb-2">Bei za Refill</h3>
            <div className="grid gap-3">
              <RefillPrice size="10ml" price={5000} />
              <RefillPrice size="20ml" price={12000} />
              <RefillPrice size="30ml" price={20000} />
            </div>
            
            <button className="w-full bg-black text-gold font-black uppercase tracking-widest py-5 rounded-[24px] flex items-center justify-center gap-2 mt-4 shadow-[6px_6px_0px_0px_rgba(212,175,55,0.2)] border-2 border-black active:scale-95 transition-all">
              <Zap size={20} /> Omba Refill Sasa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SubscriptionCard({ title, price, features, color, highlight, id }: any) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className={`p-8 rounded-[32px] border-2 ${color} space-y-6 relative overflow-hidden ${highlight ? 'shadow-2xl shadow-gold/10' : ''}`}
    >
      {highlight && (
        <div className="absolute top-0 right-0 bg-gold text-black text-[9px] font-black px-6 py-1.5 rounded-bl-[20px] uppercase tracking-widest">
          Popular
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-2xl font-black italic tracking-tighter uppercase">{title}</h3>
        <p className="text-3xl font-black">{formatPrice(price).replace('TZS', '').trim()}/- <span className="text-[10px] font-bold uppercase opacity-60 tracking-widest">mpango</span></p>
      </div>
      <ul className="space-y-3">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-tight opacity-90">
            <CheckCircle2 size={16} className="text-gold" /> {f}
          </li>
        ))}
      </ul>
      <button className={cn(
        "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2",
        highlight ? "bg-gold text-black border-gold shadow-lg" : (color.includes('black') ? "bg-white text-black border-white" : "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]")
      )}>
        Anza Sasa
      </button>
    </motion.div>
  );
}

function RefillPrice({ size, price }: any) {
  return (
    <div className="flex justify-between items-center bg-white p-5 rounded-2xl border-2 border-black/10 hover:border-black transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center border-2 border-gold/30 group-hover:border-gold transition-colors">
          <Package size={20} className="text-gold" />
        </div>
        <span className="font-black italic uppercase tracking-tighter">{size} Refill</span>
      </div>
      <span className="font-black text-black">{formatPrice(price).replace('TZS', '').trim()}/-</span>
    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
