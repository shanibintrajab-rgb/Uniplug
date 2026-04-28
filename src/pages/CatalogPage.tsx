import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, ProductCategory, ScentType } from '../types';
import { Search, Filter, MessageCircle } from 'lucide-react';
import { formatPrice, generateWhatsAppLink } from '../lib/utils';
import { motion } from 'motion/react';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<ProductCategory | 'Yote'>('Yote');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(docs);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesFilter = filter === 'Yote' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.scentType.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-black italic tracking-tighter">Katalogi</h2>
        
        {/* Search & Filter Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={18} />
            <input 
              type="text" 
              placeholder="Tafuta harufu..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-black rounded-2xl py-3.5 pl-12 focus:ring-0 outline-none text-xs font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
          <button className="bg-black text-gold p-4 rounded-2xl border-2 border-black active:scale-95 shadow-[4px_4px_0px_0px_rgba(212,175,55,0.2)]">
            <Filter size={20} />
          </button>
        </div>

        {/* Categories Chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide pt-2">
          {['Yote', '10ml', '20ml', '30ml', 'Refills'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                filter === cat ? 'bg-black text-gold border-black shadow-lg shadow-gold/20' : 'bg-white text-black border-black/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-64 border-2 border-black/5"></div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(p => (
            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={p.id} 
              className="bg-white border-2 border-black/10 rounded-[28px] overflow-hidden flex flex-col p-3 hover:border-black transition-all group"
            >
              <div className="aspect-square relative rounded-[20px] overflow-hidden mb-3 border border-black/5">
                <img 
                  src={p.image || `https://picsum.photos/seed/${p.id}/400/400`} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter">
                  {p.scentType}
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-black text-xs uppercase tracking-tighter mb-1 line-clamp-1">{p.name}</h4>
                  <p className="text-sm font-black text-black">{formatPrice(p.price).replace('TZS', '').trim()}/-</p>
                </div>
                <a 
                  href={generateWhatsAppLink(p.name, 1, "Dodoma Campus")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-2xl text-[9px] font-black uppercase tracking-wider transition-all border-2 border-black/10 hover:border-black active:scale-95"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <p className="text-gray-400 font-bold text-sm italic">Hatujapata harufu hiyo...</p>
          <button onClick={() => setFilter('Yote')} className="text-black font-black uppercase text-xs underline decoration-2 underline-offset-4 decoration-gold">Onyesha Vyote</button>
        </div>
      )}
    </div>
  );
}
