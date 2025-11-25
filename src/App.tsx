import { useState } from 'react';
import FloorPlan2D from './components/FloorPlan2D';
import FloorPlan3D from './components/FloorPlan3D';
import { Layers, Box } from 'lucide-react';

function App() {
  const [view, setView] = useState<'2d' | '3d'>('2d');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-slate-900 tracking-tight">Plano de Oficina PLIHSA</h1>
              <p className="text-sm text-slate-500 mt-1">Vista arquitectónica profesional</p>
            </div>
            <div className="flex gap-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setView('2d')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  view === '2d'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers size={18} />
                <span className="font-medium">Vista 2D</span>
              </button>
              <button
                onClick={() => setView('3d')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  view === '3d'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Box size={18} />
                <span className="font-medium">Vista 3D</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === '2d' ? <FloorPlan2D /> : <FloorPlan3D />}
      </main>
    </div>
  );
}

export default App;
