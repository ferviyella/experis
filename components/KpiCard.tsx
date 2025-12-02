import React from 'react';
import { Info } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
  colorClass?: string;
  tooltipText?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtext, icon, colorClass = "bg-white", tooltipText }) => {
  return (
    <div className={`${colorClass} p-5 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between transition-transform hover:scale-[1.02] relative group/card`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h4>
          {tooltipText && (
            <div className="relative group/tooltip z-10">
              <Info className="w-4 h-4 text-gray-400 cursor-help hover:text-indigo-500 transition-colors" />
              <div className="absolute hidden group-hover/tooltip:block bg-gray-900 text-white text-xs p-2 rounded-lg shadow-xl w-48 -left-20 top-6 z-50 pointer-events-none">
                {tooltipText}
                {/* Little arrow for the tooltip */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </div>
          )}
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
      </div>
    </div>
  );
};

export default KpiCard;