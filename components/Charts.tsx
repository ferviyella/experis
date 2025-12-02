
import React from 'react';
import {
  Bar, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { CalculationResults } from '../types';

interface ChartsProps {
  results: CalculationResults;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-sm">
        <p className="font-bold text-gray-700 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && 
              (entry.name.includes('Costo') || entry.name.includes('Flujo') || entry.name.includes('Inv') || entry.name.includes('Total')) 
              ? '$' + entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const CostComparisonChart: React.FC<ChartsProps> = ({ results }) => {
  const data = [
    {
      name: 'Año 1',
      'Costo Actual': results.currentAnnualCost,
      'Costo Recurrente (OpEx)': results.futureAnnualRecurringCost,
      'Inversión Total (Anual)': results.futureAnnualRecurringCost + results.totalOneTimeInvestment,
    },
    {
        name: 'Año 2',
        'Costo Actual': results.currentAnnualCost,
        'Costo Recurrente (OpEx)': results.futureAnnualRecurringCost,
        'Inversión Total (Anual)': results.futureAnnualRecurringCost, 
    },
    {
        name: 'Año 3',
        'Costo Actual': results.currentAnnualCost,
        'Costo Recurrente (OpEx)': results.futureAnnualRecurringCost,
        'Inversión Total (Anual)': results.futureAnnualRecurringCost,
    }
  ];

  return (
    <div className="h-72 w-full">
      <h4 className="text-sm font-semibold text-gray-600 mb-4 text-center">Comparativa: Costos vs Inversión Real</h4>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          
          <Bar dataKey="Costo Actual" fill="#9ca3af" radius={[4, 4, 0, 0]} barSize={30} name="Proceso Manual" />
          <Bar dataKey="Costo Recurrente (OpEx)" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={30} name="Proceso Automatizado" />
          
          <Line 
            type="monotone" 
            dataKey="Inversión Total (Anual)" 
            stroke="#ea580c" 
            strokeWidth={3} 
            dot={{ r: 5, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 7 }}
            name="Salida de Caja Total"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CashflowChart: React.FC<ChartsProps> = ({ results }) => {
  return (
    <div className="h-72 w-full">
       <h4 className="text-sm font-semibold text-gray-600 mb-4 text-center">Flujo de Caja Acumulado (24 Meses)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={results.monthlyData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCashflow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tickFormatter={(val) => `M${val}`} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
          <YAxis hide />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <Tooltip content={<CustomTooltip />} />
           <Area 
            type="monotone" 
            dataKey="cumulativeCashflow" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorCashflow)" 
            name="Flujo Acumulado"
            strokeWidth={2}
           />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TimeDistributionChart: React.FC<ChartsProps> = ({ results }) => {
    // We need to calculate roughly the hours distribution for visual impact
    // Total Hours Before = Hours Saved + Remaining Manual
    const totalHoursBefore = results.hoursSavedAnnually / (results.efficiencyGainPercent/100); 
    const remainingHours = totalHoursBefore - results.hoursSavedAnnually;
    
    const data = [
        { name: 'Horas Ahorradas (Robot)', value: results.hoursSavedAnnually, color: '#10b981' }, // Green
        { name: 'Trabajo Manual Residual', value: remainingHours, color: '#f59e0b' }, // Amber
    ];

    return (
        <div className="h-72 w-full">
            <h4 className="text-sm font-semibold text-gray-600 mb-4 text-center">Optimización de Tiempo (Eficiencia)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => Math.round(value).toLocaleString() + ' hrs'} />
                    <Legend verticalAlign="bottom" height={36}/>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold text-gray-700">
                        {Math.round(results.efficiencyGainPercent)}%
                    </text>
                    <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-xs text-gray-500">
                        Eficiencia
                    </text>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
