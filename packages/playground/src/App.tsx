import React, { useState } from 'react';
import { CircuitBuilder } from './components/CircuitBuilder';
import { CodeEditor } from './components/CodeEditor';
import { ProofVisualizer } from './components/ProofVisualizer';
import { ExampleGallery } from './components/ExampleGallery';
import { PerformanceProfiler } from './components/PerformanceProfiler';
import { 
  Code2, 
  Play, 
  Zap, 
  BookOpen, 
  BarChart3,
  Moon,
  Github,
  FileCode
} from 'lucide-react';

type TabType = 'builder' | 'editor' | 'visualizer' | 'examples' | 'profiler';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('builder');
  const [currentCircuit, setCurrentCircuit] = useState<any>(null);
  const [compactCode, setCompactCode] = useState<string>('');

  const tabs = [
    { id: 'builder', label: 'Circuit Builder', icon: Zap },
    { id: 'editor', label: 'Code Editor', icon: Code2 },
    { id: 'visualizer', label: 'Proof Visualizer', icon: Play },
    { id: 'examples', label: 'Examples', icon: BookOpen },
    { id: 'profiler', label: 'Performance', icon: BarChart3 },
  ];

  const handleCircuitUpdate = (circuit: any) => {
    setCurrentCircuit(circuit);
    // Generate Compact code from circuit
    const code = generateCompactCode(circuit);
    setCompactCode(code);
  };

  const generateCompactCode = (circuit: any): string => {
    // Simplified code generation
    return `// Generated Midnight Compact Contract
contract ZKCircuit {
  secret input: Field;
  public output: Field;
  
  export function prove(): Field {
    // Circuit logic here
    let result = input;
    ${circuit ? '// Custom circuit logic' : ''}
    return result;
  }
  
  export function verify(proof: Proof): Bool {
    // Verification logic
    return true;
  }
}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Moon className="w-8 h-8 text-purple-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Midnight ZK Playground
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                <FileCode className="w-4 h-4" />
                <span>Export to Compact</span>
              </button>
              <a 
                href="https://github.com/midnight-devkit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    flex items-center space-x-2 px-4 py-3 border-b-2 transition-all
                    ${activeTab === tab.id 
                      ? 'border-purple-500 text-purple-400 bg-gray-700/50' 
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700/30'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-xl min-h-[600px]">
          {activeTab === 'builder' && (
            <CircuitBuilder 
              onCircuitUpdate={handleCircuitUpdate}
              currentCircuit={currentCircuit}
            />
          )}
          {activeTab === 'editor' && (
            <CodeEditor 
              code={compactCode}
              onChange={setCompactCode}
            />
          )}
          {activeTab === 'visualizer' && (
            <ProofVisualizer 
              circuit={currentCircuit}
              code={compactCode}
            />
          )}
          {activeTab === 'examples' && (
            <ExampleGallery 
              onSelectExample={(example) => {
                setCurrentCircuit(example.circuit);
                setCompactCode(example.code);
                setActiveTab('editor');
              }}
            />
          )}
          {activeTab === 'profiler' && (
            <PerformanceProfiler 
              circuit={currentCircuit}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <p>© 2024 Midnight DevKit - Built for the Midnight Network Challenge</p>
            <div className="flex items-center space-x-6">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">API Reference</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
