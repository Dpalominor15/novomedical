import React from 'react';
import { Activity, Users, Calendar, Settings, FileText, LayoutDashboard, Stethoscope, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  }

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 z-10 hidden md:flex">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
        <div className="bg-primary p-2 rounded-lg">
          <Activity size={24} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">MediCore AI</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4 px-2">Clínica</div>
        <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            onClick={() => navigate('/dashboard')} 
            active={location.pathname === '/dashboard'} 
        />
        <NavItem icon={<Users size={20} />} label="Pacientes" />
        <NavItem icon={<Calendar size={20} />} label="Agenda" />
        
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-8 px-2">Gestión</div>
        <NavItem icon={<FileText size={20} />} label="Historias Clínicas" />
        <NavItem icon={<Stethoscope size={20} />} label="Diagnósticos IA" />
        
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-8 px-2">Sistema</div>
        <NavItem icon={<Settings size={20} />} label="Configuración" />
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center font-bold">DR</div>
          <div>
            <p className="text-sm font-medium">Dr. Ramirez</p>
            <p className="text-xs text-slate-400">Medicina Interna</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center space-x-2 text-slate-400 hover:text-white w-full">
            <LogOut size={16} /> <span className="text-xs">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button onClick={onClick} className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${active ? 'bg-primary text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800'}`}>
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default Sidebar;
