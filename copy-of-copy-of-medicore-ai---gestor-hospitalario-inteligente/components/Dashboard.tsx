import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Filter, AlertTriangle, User, ChevronRight } from 'lucide-react';
import { PATIENTS_DB } from '../constants';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = PATIENTS_DB.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.triageNote?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 flex flex-col h-screen overflow-hidden">
        
        {/* Top Bar */}
        <div className="bg-white p-6 shadow-sm border-b border-gray-200 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard de Control</h1>
                <p className="text-slate-500 text-sm">Resumen de actividad y pacientes en espera</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="text-sm font-bold text-slate-700">Dr. Alejandro Ramirez</p>
                    <p className="text-xs text-green-600 font-semibold">● En Línea</p>
                </div>
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600">
                    <User size={20} />
                </div>
            </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Pacientes en Espera" value={filteredPatients.filter(p => p.status === 'Waiting').length} icon={<Clock size={20} />} color="blue" />
                <StatCard label="Tiempo Promedio" value="18 min" icon={<Clock size={20} />} color="orange" />
                <StatCard label="Casos Críticos" value="1" icon={<AlertTriangle size={20} />} color="red" />
                <StatCard label="Total Hoy" value="24" icon={<User size={20} />} color="green" />
            </div>

            {/* Patient List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h2 className="font-bold text-lg text-slate-700">Lista de Pacientes</h2>
                    
                    <div className="flex gap-2">
                         <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Buscar por nombre, síntomas..." 
                                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                         </div>
                         <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">
                             <Filter size={18} />
                         </button>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Paciente</th>
                            <th className="px-6 py-4">Edad/Sexo</th>
                            <th className="px-6 py-4">Motivo / Triaje</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Tiempo Espera</th>
                            <th className="px-6 py-4">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPatients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/patient/${patient.id}`)}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <img src={patient.avatarUrl} alt="" className="w-10 h-10 rounded-full mr-3 object-cover" />
                                        <div>
                                            <div className="font-bold text-slate-700">{patient.name}</div>
                                            <div className="text-xs text-slate-400">{patient.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {patient.age} años / {patient.gender === 'Femenino' ? 'F' : 'M'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-slate-700 block">{patient.triageNote}</span>
                                    {/* Smart Alert Logic in Dashboard */}
                                    {patient.name.includes('Maria') && (
                                        <span className="inline-flex items-center text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded mt-1 font-bold">
                                            <AlertTriangle size={10} className="mr-1" /> ALERTA IA: Labs Anormales
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={patient.status} />
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className={`font-bold ${patient.waitTimeMinutes > 30 ? 'text-red-500' : 'text-slate-600'}`}>
                                        {patient.waitTimeMinutes} min
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-primary hover:text-teal-800 font-bold text-sm flex items-center">
                                        Atender <ChevronRight size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredPatients.length === 0 && (
                    <div className="p-8 text-center text-slate-400">
                        No se encontraron pacientes.
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        'Waiting': 'bg-orange-100 text-orange-700',
        'In_Consultation': 'bg-blue-100 text-blue-700',
        'Discharged': 'bg-green-100 text-green-700',
        'Referred': 'bg-purple-100 text-purple-700'
    };
    const labels: any = {
        'Waiting': 'En Espera',
        'In_Consultation': 'En Consulta',
        'Discharged': 'Alta',
        'Referred': 'Derivado'
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
            {labels[status] || status}
        </span>
    );
};

const StatCard = ({ label, value, icon, color }: any) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center">
        <div className={`p-3 rounded-lg mr-4 bg-${color}-100 text-${color}-600`}>
            {icon}
        </div>
        <div>
            <div className="text-2xl font-bold text-slate-800">{value}</div>
            <div className="text-xs text-slate-500 uppercase font-semibold">{label}</div>
        </div>
    </div>
);

export default Dashboard;
