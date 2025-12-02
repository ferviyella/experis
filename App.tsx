
import React, { useState, useMemo } from 'react';
import InputForm from './components/InputForm';
import KpiCard from './components/KpiCard';
import { CostComparisonChart, CashflowChart, TimeDistributionChart } from './components/Charts';
import AiProposal from './components/AiProposal';
import { calculateROI } from './utils/calculations';
import { generateExecutiveSummary } from './services/geminiService';
import { ProcessInputs, AutomationCosts, AiProposalState } from './types';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  PieChart, 
  Briefcase,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const APP_PASSWORD = "V1y3ll4";

const INITIAL_INPUTS: ProcessInputs = {
  processName: '',
  volumePerMonth: 5000,
  timePerTransactionMinutes: 5,
  errorRatePercent: 5,
  fteHourlyCost: 25,
  reworkTimeMinutes: 10
};

const INITIAL_COSTS: AutomationCosts = {
  implementationCost: 15000,
  annualLicenseCost: 5000,
  annualMaintenanceCost: 2000,
  estimatedAutomationPercentage: 90
};

const App: React.FC = () => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- App State ---
  const [inputs, setInputs] = useState<ProcessInputs>(INITIAL_INPUTS);
  const [costs, setCosts] = useState<AutomationCosts>(INITIAL_COSTS);

  const [aiState, setAiState] = useState<AiProposalState>({
    isLoading: false,
    content: null,
    error: null
  });

  // --- Real-time Calculations ---
  const results = useMemo(() => calculateROI(inputs, costs), [inputs, costs]);

  // --- Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === APP_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleReset = () => {
    if (window.confirm("¿Estás seguro de que quieres limpiar todos los datos y restablecer la calculadora?")) {
      setInputs(INITIAL_INPUTS);
      setCosts(INITIAL_COSTS);
      setAiState({ isLoading: false, content: null, error: null });
    }
  };

  const handleAiGeneration = async () => {
    setAiState({ isLoading: true, content: null, error: null });
    try {
      const summary = await generateExecutiveSummary(inputs, costs, results);
      setAiState({ isLoading: false, content: summary, error: null });
    } catch (err) {
      setAiState({ 
        isLoading: false, 
        content: null, 
        error: "Error: Asegúrate de tener configurada la API Key en el entorno." 
      });
    }
  };

  // --- Login Screen Render ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg mb-4 transform rotate-3">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Experis<span className="text-indigo-600">Insight</span></h1>
            <p className="text-gray-500 text-sm mt-2">Sistema de Estimación de ROI</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña de Acceso</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Ingrese clave de seguridad..."
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-indigo-600 focus:outline-none transition-colors"
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            {authError && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse">
                 <AlertTriangle className="w-4 h-4" /> 
                 <span>Contraseña incorrecta. Intente de nuevo.</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex justify-center items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Acceder al Sistema
            </button>
          </form>
          
          <div className="mt-8 text-center border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400">
              ExperisInsight &copy; 2024. Solo personal autorizado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Main App Render ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-white via-indigo-50/20 to-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Experis<span className="text-indigo-600">Insight</span></h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium text-xs">Versión Pro</span>
                <span>RPA ROI Calculator</span>
             </div>
             <button 
               onClick={() => setIsAuthenticated(false)} 
               className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
               title="Cerrar Sesión"
             >
               <Lock className="w-4 h-4" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs (4 cols) */}
          <div className="lg:col-span-4">
            <InputForm 
              inputs={inputs} 
              costs={costs} 
              setInputs={setInputs} 
              setCosts={setCosts}
              onReset={handleReset} 
            />
          </div>

          {/* Right Column: Dashboard (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* KPI Cards Row 1: Financials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <KpiCard 
                title="ROI (1er Año)"
                value={`${results.roiYear1.toFixed(1)}%`}
                icon={<TrendingUp className="w-5 h-5 text-green-600" />}
                subtext={results.roiYear1 > 0 ? "Inversión Rentable" : "Revisar Costos"}
                colorClass={results.roiYear1 > 100 ? "bg-gradient-to-br from-white to-green-50 border-green-200" : "bg-white"}
                tooltipText="Porcentaje de retorno sobre la inversión inicial + costos operativos durante el primer año. Un valor positivo indica rentabilidad."
              />
               <KpiCard 
                title="Mes de Retorno (Payback)"
                value={`${results.paybackPeriodMonths.toFixed(1)} Meses`}
                icon={<Calendar className="w-5 h-5 text-blue-600" />}
                subtext={`Punto de equilibrio real`}
                tooltipText="Tiempo necesario para que los ahorros acumulados cubran completamente el costo de implementación."
              />
              <KpiCard 
                title="Ahorro Neto (3 Años)"
                value={`$${results.netSavingsYear3.toLocaleString()}`}
                icon={<DollarSign className="w-5 h-5 text-indigo-600" />}
                subtext="Proyección a largo plazo"
                tooltipText="Dinero total ahorrado proyectado a 3 años, descontando la inversión inicial, licencias y mantenimiento."
              />
            </div>

            {/* KPI Cards Row 2: Optimization Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
               <KpiCard 
                title="Capacidad Ganada"
                value={`${results.fteCapacityGained.toFixed(1)} FTEs`}
                icon={<Users className="w-5 h-5 text-purple-600" />}
                subtext="Talento reubicable"
                tooltipText="Equivalente a empleados a tiempo completo (Full Time Employees) liberados de tareas manuales para trabajo de mayor valor."
              />
               <KpiCard 
                title="Costo Unitario"
                value={`$${results.costPerTransactionFuture.toFixed(2)}`}
                icon={<Target className="w-5 h-5 text-pink-600" />}
                subtext={`Antes: $${results.costPerTransactionCurrent.toFixed(2)}`}
                tooltipText="Comparativa del costo de procesar una sola transacción antes vs. después de la automatización."
              />
               <KpiCard 
                title="Ahorro por Errores"
                value={`$${Math.round(results.errorCostAvoided).toLocaleString()}`}
                icon={<AlertTriangle className="w-5 h-5 text-orange-600" />}
                subtext="Costo de calidad evitado"
                tooltipText="Dinero ahorrado al evitar el retrabajo (rework) causado por errores humanos manuales."
              />
              <KpiCard 
                title="% Eficiencia"
                value={`${Math.round(results.efficiencyGainPercent)}%`}
                icon={<PieChart className="w-5 h-5 text-teal-600" />}
                subtext="Reducción de tiempos"
                tooltipText="Porcentaje de reducción en el tiempo total dedicado al proceso (incluyendo ejecución y corrección de errores)."
              />
              <KpiCard 
                title="Tasa de Éxito"
                value={`${results.processSuccessRate.toFixed(1)}%`}
                icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
                subtext="Calidad x Cobertura"
                tooltipText="Probabilidad de ejecución perfecta combinando el % de automatización con la reducción de la tasa de errores manuales."
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <CostComparisonChart results={results} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <TimeDistributionChart results={results} />
                </div>
            </div>

            {/* Wide Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <CashflowChart results={results} />
            </div>

            {/* AI Proposal Section */}
            <AiProposal aiState={aiState} onGenerate={handleAiGeneration} />
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
