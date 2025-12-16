import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { VITALS_DATA } from '../constants';

const VitalChart = () => {
  return (
    <div className="h-64 w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-600 mb-4">Tendencia de Signos Vitales (5 Meses)</h3>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={VITALS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend />
                <Line type="monotone" dataKey="heartRate" name="Pulso (lpm)" stroke="#ef4444" strokeWidth={2} dot={{r: 4}} />
                <Line type="monotone" dataKey="bpSys" name="P. Sistólica" stroke="#0f766e" strokeWidth={2} dot={{r: 4}} />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default VitalChart;
