import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, ProductCategory, ScentType } from '../types';
import { Plus, Trash2, Edit2, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: ProductCategory.TenML,
    scentType: ScentType.Floral,
    image: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
  };

  const handleAddProduct = async () => {
    try {
      await addDoc(collection(db, 'products'), newProduct);
      setShowAddModal(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Una uhakika unataka kufuta bidhaa hii?')) {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gold text-black p-2 rounded-lg flex items-center gap-2 font-bold text-sm"
        >
          <Plus size={20} /> Ongeza Bidhaa
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<TrendingUp />} label="Mauzo" value="TZS 1.2M" />
        <StatCard icon={<Users />} label="Wateja" value="156" />
        <StatCard icon={<ShoppingCart />} label="Oda Mpya" value="12" />
        <StatCard icon={<DollarSign />} label="Faida" value="TZS 450k" />
      </div>

      {/* Product Management */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Simamia Bidhaa</h3>
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="flex items-center gap-4 bg-white border border-gray-100 p-3 rounded-2xl">
              <img src={p.image || `https://picsum.photos/seed/${p.id}/100/100`} className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-sm">{p.name}</h4>
                <p className="text-xs text-gold font-bold">{formatPrice(p.price)}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><Edit2 size={16} /></button>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-center py-8 text-gray-400 text-sm">Hakuna bidhaa kwenye mfumo.</p>
          )}
        </div>
      </div>

      {/* Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl p-8 space-y-4">
            <h3 className="text-xl font-bold">Ongeza Bidhaa Mpya</h3>
            <input 
              placeholder="Jina la Manukato" 
              className="w-full bg-gray-100 p-4 rounded-2xl"
              onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="Bei (TZS)" 
              className="w-full bg-gray-100 p-4 rounded-2xl"
              onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
            />
            <select 
              className="w-full bg-gray-100 p-4 rounded-2xl"
              onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}
            >
              {Object.values(ProductCategory).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select 
              className="w-full bg-gray-100 p-4 rounded-2xl"
              onChange={e => setNewProduct({...newProduct, scentType: e.target.value as any})}
            >
              {Object.values(ScentType).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button 
              onClick={handleAddProduct}
              className="w-full bg-black text-white font-bold py-4 rounded-2xl"
            >
              Hifadhi Bidhaa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white border border-gray-100 p-4 rounded-2xl space-y-2 shadow-sm">
      <div className="bg-gold/10 w-8 h-8 rounded-lg flex items-center justify-center text-gold">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400">{label}</p>
        <p className="text-lg font-black">{value}</p>
      </div>
    </div>
  );
}
