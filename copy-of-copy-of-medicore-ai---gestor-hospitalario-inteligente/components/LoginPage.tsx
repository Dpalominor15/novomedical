import React from 'react';
import { Activity, ShieldCheck, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-primary p-8 text-center">
          <div className="inline-flex p-3 bg-white/20 rounded-xl mb-4">
            <Activity size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MediCore AI</h1>
          <p className="text-teal-100">Gestión Hospitalaria Inteligente</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuario / ID Médico</label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="dr.ramirez"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
              <ShieldCheck className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <div className="relative">
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-colors shadow-lg active:scale-95"
          >
            Acceder al Sistema
          </button>

          <div className="text-center mt-4">
             <p className="text-xs text-slate-400 max-w-xs mx-auto">
               Advertencia de Seguridad: Acceso restringido únicamente a personal médico autorizado. Todas las acciones son monitoreadas.
             </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
