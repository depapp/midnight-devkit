import React, { useState, useEffect } from 'react';
import { Shield, Clock, Cpu, CheckCircle, XCircle, Loader } from 'lucide-react';

interface ProofVisualizerProps {
  circuit: any;
  code: string;
}

export function ProofVisualizer({ circuit, code }: ProofVisualizerProps) {
  const [proofStatus, setProofStatus] = useState<'idle' | 'generating' | 'verifying' | 'success' | 'failed'>('idle');
  const [proofData, setProofData] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const generateProof = async () => {
    setProofStatus('generating');
    setProgress(0);
    setLogs([]);
    
    // Simulate proof generation steps
    const steps = [
      { progress: 10, log: '🔍 Parsing circuit structure...' },
      { progress: 25, log: '🔧 Setting up proving key...' },
      { progress: 40, log: '🔐 Generating witness...' },
      { progress: 55, log: '📊 Computing polynomial commitments...' },
      { progress: 70, log: '🧮 Performing FFT operations...' },
      { progress: 85, log: '✨ Finalizing proof...' },
      { progress: 100, log: '✅ Proof generated successfully!' },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(step.progress);
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step.log}`]);
    }

    // Generate mock proof data
    const proof = {
      pi_a: generateRandomHex(64),
      pi_b: generateRandomHex(64),
      pi_c: generateRandomHex(64),
      publicSignals: [
        generateRandomHex(32),
        generateRandomHex(32),
      ],
      protocol: 'groth16',
      curve: 'bn128',
    };

    setProofData(proof);
    setProofStatus('verifying');

    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProofStatus('success');
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ Proof verified successfully!`]);
  };

  const generateRandomHex = (length: number): string => {
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  const formatProofSize = (proof: any): string => {
    const jsonStr = JSON.stringify(proof);
    const bytes = new TextEncoder().encode(jsonStr).length;
    return `${bytes} bytes`;
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Proof Visualizer</h2>
        <p className="text-gray-400">Generate and verify zero-knowledge proofs for your circuit</p>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={generateProof}
            disabled={proofStatus === 'generating' || proofStatus === 'verifying'}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              proofStatus === 'generating' || proofStatus === 'verifying'
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {proofStatus === 'generating' || proofStatus === 'verifying' ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Shield className="w-5 h-5" />
            )}
            <span>
              {proofStatus === 'idle' ? 'Generate Proof' :
               proofStatus === 'generating' ? 'Generating...' :
               proofStatus === 'verifying' ? 'Verifying...' :
               'Generate New Proof'}
            </span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Est. time: 3-5s</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">CPU: 45%</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {(proofStatus === 'generating' || proofStatus === 'verifying') && (
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-2 gap-6">
        {/* Proof Data */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center justify-between">
            Proof Data
            {proofStatus === 'success' && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {proofStatus === 'failed' && (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </h3>
          
          {proofData ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400">Protocol</label>
                <div className="bg-gray-800 p-2 rounded mt-1 font-mono text-sm">
                  {proofData.protocol}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Curve</label>
                <div className="bg-gray-800 p-2 rounded mt-1 font-mono text-sm">
                  {proofData.curve}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Proof π_a</label>
                <div className="bg-gray-800 p-2 rounded mt-1 font-mono text-xs break-all">
                  {proofData.pi_a}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Public Signals</label>
                <div className="bg-gray-800 p-2 rounded mt-1">
                  {proofData.publicSignals.map((signal: string, i: number) => (
                    <div key={i} className="font-mono text-xs break-all mb-1">
                      [{i}]: {signal}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Proof Size</label>
                <div className="bg-gray-800 p-2 rounded mt-1 font-mono text-sm">
                  {formatProofSize(proofData)}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">
              No proof generated yet. Click "Generate Proof" to start.
            </div>
          )}
        </div>

        {/* Logs */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Generation Logs</h3>
          <div className="bg-gray-900 rounded p-3 h-96 overflow-auto">
            {logs.length > 0 ? (
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="text-xs font-mono text-gray-300">
                    {log}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                Logs will appear here during proof generation...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      {proofData && (
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">3.2s</div>
            <div className="text-xs text-gray-400">Generation Time</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">0.8s</div>
            <div className="text-xs text-gray-400">Verification Time</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">256</div>
            <div className="text-xs text-gray-400">Constraints</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-400">98%</div>
            <div className="text-xs text-gray-400">Optimization</div>
          </div>
        </div>
      )}
    </div>
  );
}
