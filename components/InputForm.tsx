
import React from 'react';
import { ProcessInputs, AutomationCosts } from '../types';
import { Calculator, Zap, RotateCcw } from 'lucide-react';

interface InputFormProps {
  inputs: ProcessInputs;
  costs: AutomationCosts;
  setInputs: React.Dispatch<React.SetStateAction<ProcessInputs>>;
  setCosts: React.Dispatch<React.SetStateAction<AutomationCosts>>;
  onReset: () => void;
}

const RequiredLabel = ({ text }: { text: string }) => (
  <label className="block text-sm font-semibold text-gray-800 mb-1">
    {text} <span className="text-red-500">*</span>
  </label>
);

const OptionalLabel = ({ text }: { text: string }) => (
  <label className="block text-sm font-medium text-gray-500 mb-1 flex justify-between items-center">
    {text}
    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase tracking-wide">Opcional</span>
  </label>
);

const InputForm: React.FC<InputFormProps> = ({ inputs, costs, setInputs, setCosts, onReset }) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) || 0 : value;
    
    if (name in inputs) {
      setInputs(prev => ({ ...prev, [name]: val }));
    } else {
      setCosts(prev => ({ ...prev, [name]: val }));
    }
  };

  // Base classes for consistent styling
  const baseInputClass = "w-full outline-none transition-all duration-300 ease-in-out focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 focus:shadow-md hover:border-indigo-300";
  
  // Specific style for "Required" fields (Left Border Accent)
  const requiredInputClass = `${baseInputClass} px-4 py-2 border-l-4 border-l-indigo-500 border-y border-r border-gray-300 rounded-r-lg`;
  
  // Specific style for "Optional" fields (Standard Box)
  const optionalInputClass = `${baseInputClass} px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white`;

  // Specific style for Inputs with Icons/Prefixes (Padding adjusted)
  const currencyInputClass = `${baseInputClass} pl-8 pr-4 py-2 border-l-4 border-l-indigo-500 border-y border-r border-gray-300 rounded-r-lg`;
  const optionalCurrencyClass = `${baseInputClass} pl-8 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white`;
  const percentageInputClass = `${baseInputClass} pl-9 pr-4 py-2 border-l-4 border-l-indigo-500 border-y border-r border-gray-300 rounded-r-lg`;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-600" />
          Configuración
        </h2>
        <button 
          onClick={onReset}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Limpiar datos / Restablecer valores"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Section 1: Process Details */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-indigo-100 pb-2">
          1. Perfil del Proceso (As-Is)
        </h3>
        
        <div className="space-y-5">
          <div>
            <OptionalLabel text="Nombre del Proceso" />
            <input
              type="text"
              name="processName"
              value={inputs.processName}
              onChange={handleInputChange}
              className={optionalInputClass.replace('bg-gray-50', 'bg-white')} // Force white bg for text input
              placeholder="Ej. Conciliación Bancaria"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <RequiredLabel text="Volumen Mensual" />
              <div className="relative group">
                <input
                  type="number"
                  name="volumePerMonth"
                  value={inputs.volumePerMonth}
                  onChange={handleInputChange}
                  className={requiredInputClass}
                />
                <span className="absolute right-3 top-2 text-gray-400 text-xs pointer-events-none group-hover:text-indigo-500 transition-colors">txs</span>
              </div>
            </div>
            <div>
              <RequiredLabel text="Minutos x Transacción" />
               <div className="relative group">
                <input
                  type="number"
                  name="timePerTransactionMinutes"
                  value={inputs.timePerTransactionMinutes}
                  onChange={handleInputChange}
                  className={requiredInputClass}
                />
                <span className="absolute right-3 top-2 text-gray-400 text-xs pointer-events-none group-hover:text-indigo-500 transition-colors">min</span>
              </div>
            </div>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <RequiredLabel text="Costo Hora FTE" />
              <div className="relative group">
                <div className="absolute left-3 top-2 text-gray-400 pointer-events-none group-hover:text-indigo-500 transition-colors">$</div>
                <input
                  type="number"
                  name="fteHourlyCost"
                  value={inputs.fteHourlyCost}
                  onChange={handleInputChange}
                  className={currencyInputClass}
                />
              </div>
            </div>
             <div>
              <OptionalLabel text="Tasa de Error" />
              <div className="relative group">
                <input
                  type="number"
                  name="errorRatePercent"
                  value={inputs.errorRatePercent}
                  onChange={handleInputChange}
                  className={optionalInputClass}
                />
                <span className="absolute right-3 top-2 text-gray-400 text-xs pointer-events-none group-hover:text-indigo-500 transition-colors">%</span>
              </div>
            </div>
           </div>
           
           <div>
              <OptionalLabel text="Tiempo de Retrabajo (x Error)" />
              <div className="relative group">
                <input
                  type="number"
                  name="reworkTimeMinutes"
                  value={inputs.reworkTimeMinutes}
                  onChange={handleInputChange}
                  className={optionalInputClass}
                />
                <span className="absolute right-3 top-2 text-gray-400 text-xs pointer-events-none group-hover:text-indigo-500 transition-colors">min</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">* Se usa para calcular ahorros por calidad</p>
           </div>
        </div>
      </div>

      {/* Section 2: Automation Costs */}
      <div>
        <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-indigo-100 pb-2">
          2. Inversión (Estimado)
        </h3>
        
        <div className="space-y-5">
           <div>
            <RequiredLabel text="Costo Implementación" />
            <div className="relative group">
              <div className="absolute left-3 top-2 text-gray-400 pointer-events-none group-hover:text-indigo-500 transition-colors">$</div>
              <input
                type="number"
                name="implementationCost"
                value={costs.implementationCost}
                onChange={handleInputChange}
                className={currencyInputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <OptionalLabel text="Licencias (Anual)" />
              <div className="relative group">
                <div className="absolute left-3 top-2 text-gray-400 pointer-events-none group-hover:text-indigo-500 transition-colors">$</div>
                <input
                  type="number"
                  name="annualLicenseCost"
                  value={costs.annualLicenseCost}
                  onChange={handleInputChange}
                  className={optionalCurrencyClass}
                />
              </div>
            </div>
            <div>
              <OptionalLabel text="Mantenimiento (Anual)" />
               <div className="relative group">
                <div className="absolute left-3 top-2 text-gray-400 pointer-events-none group-hover:text-indigo-500 transition-colors">$</div>
                <input
                  type="number"
                  name="annualMaintenanceCost"
                  value={costs.annualMaintenanceCost}
                  onChange={handleInputChange}
                  className={optionalCurrencyClass}
                />
              </div>
            </div>
          </div>

           <div>
            <RequiredLabel text="% Automatización" />
            <div className="relative group">
               <Zap className="absolute left-3 top-2.5 w-4 h-4 text-yellow-500 pointer-events-none group-focus-within:animate-pulse" />
              <input
                type="number"
                name="estimatedAutomationPercentage"
                min="0"
                max="100"
                value={costs.estimatedAutomationPercentage}
                onChange={handleInputChange}
                className={percentageInputClass}
              />
               <span className="absolute right-3 top-2 text-gray-400 text-xs pointer-events-none group-hover:text-indigo-500 transition-colors">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
