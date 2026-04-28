import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, ProductCategory } from '../types';
import { motion } from 'motion/react';
import { Package, RefreshCw, Zap, ArrowRight, Star } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export default function HomePage({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const q = query(collection(db, 'products'), limit(3));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setFeaturedProducts(docs);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Banner */}
      <section className="px-6 pt-6">
        <div className="bg-black rounded-[32px] p-8 text-white relative overflow-hidden border-4 border-black">
          <div className="relative z-10 space-y-4">
            <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Oferta ya Leo</p>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-black leading-none italic tracking-tighter"
            >
              Manukato ya Ubora <br/> kwa <span className="text-gold">Bei ya Mwanafunzi</span>
            </motion.h2>
            <button 
              onClick={() => onNavigate('catalog')}
              className="mt-4 bg-gold text-black px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-wider hover:bg-yellow-500 transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
            >
              Agiza Sasa
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-gold rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
             <Package size={120} className="text-white" />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-6 flex gap-3">
        <QuickAction 
          icon={<RefreshCw className="text-white" />} 
          label="Refill" 
          onClick={() => onNavigate('subscriptions')} 
          variant="light"
        />
        <QuickAction 
          icon={<Zap className="text-gold" />} 
          label="Jiunge" 
          onClick={() => onNavigate('subscriptions')} 
          variant="dark"
        />
        <QuickAction 
          icon={<Star className="text-white" />} 
          label="Mawakala" 
          onClick={() => onNavigate('catalog')} 
          variant="light"
        />
      </section>

      {/* Featured Products */}
      <section className="px-6 space-y-6">
        <div className="flex justify-between items-end border-b-2 border-black pb-2">
          <h3 className="text-xl font-black italic tracking-tighter">Maarufu Sasa</h3>
          <button onClick={() => onNavigate('catalog')} className="text-gold text-xs font-black uppercase underline decoration-2 underline-offset-4">Zote</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {featuredProducts.length > 0 ? (
            featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))
          ) : (
             [1,2].map(i => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-[24px] h-56 border-2 border-black/5"></div>
             ))
          )}
        </div>
      </section>
    </div>
  );
}

function QuickAction({ icon, label, onClick, variant }: { icon: React.ReactNode, label: string, onClick: () => void, variant: 'light' | 'dark' }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-95",
        variant === 'dark' ? "bg-black border-black text-gold shadow-lg shadow-gold/20" : "bg-gray-100 border-black/5 text-black"
      )}
    >
      <div className={variant === 'dark' ? "text-gold" : "text-black opacity-60"}>{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.97 }}
      className="bg-white border-2 border-black/10 rounded-[24px] overflow-hidden p-3 hover:border-black transition-colors"
    >
      <div className="aspect-square bg-gray-50 rounded-[18px] relative mb-3 overflow-hidden border border-black/5">
        <img 
          src={product.image || `https://picsum.photos/seed/${product.id}/400/400`} 
          alt={product.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2 bg-black text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">
          {product.category}
        </div>
      </div>
      <div className="space-y-0.5">
        <h4 className="font-black text-xs uppercase tracking-tighter truncate">{product.name}</h4>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{product.scentType}</p>
        <div className="flex justify-between items-center pt-2">
          <span className="font-black text-sm">{formatPrice(product.price).replace('TZS', '').trim()}/-</span>
          <div className="w-6 h-6 bg-[#25D366] rounded-full flex items-center justify-center border border-black/10">
            <div className="w-2 h-2 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
