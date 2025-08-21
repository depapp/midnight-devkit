import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, Cpu, HardDrive, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PerformanceProfilerProps {
  circuit: any;
}

export function PerformanceProfiler({ circuit }: PerformanceProfilerProps) {
  const [isProfilering, setIsProfilering] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  // Mock performance data
  const timeSeriesData = [
    { time: '0s', cpu: 10, memory: 20, proof: 0 },
    { time: '1s', cpu: 45, memory: 35, proof: 15 },
    { time: '2s', cpu: 78, memory: 52, proof: 45 },
    { time: '3s', cpu: 92, memory: 68, proof: 78 },
    { time: '4s', cpu: 85, memory: 71, proof: 92 },
    { time: '5s', cpu: 40, memory: 65, proof: 100 },
  ];

  const operationBreakdown = [
    { name: 'FFT Operations', value: 35, color: '#a855f7' },
    { name: 'Polynomial Commitment', value: 25, color: '#3b82f6' },
    { name: 'Witness Generation', value: 20, color: '#10b981' },
    { name: 'Hash Computations', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#6b7280' },
  ];

  const constraintAnalysis = [
    { type: 'R1CS Constraints', count: 256, time: '1.2s' },
    { type: 'Linear Combinations', count: 128, time: '0.8s' },
    { type: 'Quadratic Constraints', count: 64, time: '0.5s' },
    { type: 'Boolean Constraints', count: 32, time: '0.2s' },
  ];

  const runProfiler = async () => {
    setIsProfilering(true);
    
    // Simulate profiling
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setProfileData({
      totalTime: 3.2,
      peakMemory: 128,
      avgCpu: 65,
      gasEstimate: 21000,
      proofSize: 256,
      constraints: 480,
    });
    
    setIsProfilering(false);
  };

  const getOptimizationScore = () => {
    if (!profileData) return 0;
    // Calculate optimization score based on various metrics
    const timeScore = Math.max(0, 100 - (profileData.totalTime * 10));
    const memoryScore = Math.max(0, 100 - (profileData.peakMemory / 2));
    const gasScore = Math.max(0, 100 - (profileData.gasEstimate / 500));
    return Math.round((timeScore + memoryScore + gasScore) / 3);
  };

  const getOptimizationColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="h-full p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Performance Profiler</h2>
        <p className="text-gray-400">Analyze and optimize your ZK circuit performance</p>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={runProfiler}
            disabled={isProfilering}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              isProfilering ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            <Activity className={`w-5 h-5 ${isProfilering ? 'animate-pulse' : ''}`} />
            <span>{isProfilering ? 'Profiling...' : 'Run Performance Analysis'}</span>
          </button>

          {profileData && (
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getOptimizationColor(getOptimizationScore())}`}>
                  {getOptimizationScore()}%
                </div>
                <div className="text-xs text-gray-400">Optimization Score</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      {profileData && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <Clock className="w-5 h-5 text-blue-400 mb-2" />
            <div className="text-2xl font-bold">{profileData.totalTime}s</div>
            <div className="text-xs text-gray-400">Total Time</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <HardDrive className="w-5 h-5 text-green-400 mb-2" />
            <div className="text-2xl font-bold">{profileData.peakMemory}MB</div>
            <div className="text-xs text-gray-400">Peak Memory</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <Cpu className="w-5 h-5 text-purple-400 mb-2" />
            <div className="text-2xl font-bold">{profileData.avgCpu}%</div>
            <div className="text-xs text-gray-400">Avg CPU</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <Zap className="w-5 h-5 text-yellow-400 mb-2" />
            <div className="text-2xl font-bold">{profileData.gasEstimate}</div>
            <div className="text-xs text-gray-400">Gas Estimate</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <TrendingUp className="w-5 h-5 text-orange-400 mb-2" />
            <div className="text-2xl font-bold">{profileData.proofSize}B</div>
            <div className="text-xs text-gray-400">Proof Size</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-red-400 mb-2" />
            <div className="text-2xl font-bold">{profileData.constraints}</div>
            <div className="text-xs text-gray-400">Constraints</div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Time Series Chart */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Resource Usage Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Legend />
              <Line type="monotone" dataKey="cpu" stroke="#a855f7" name="CPU %" strokeWidth={2} />
              <Line type="monotone" dataKey="memory" stroke="#3b82f6" name="Memory %" strokeWidth={2} />
              <Line type="monotone" dataKey="proof" stroke="#10b981" name="Progress %" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Operation Breakdown */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Operation Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={operationBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {operationBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Constraint Analysis */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Constraint Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-2 px-4 text-sm text-gray-400">Constraint Type</th>
                <th className="text-right py-2 px-4 text-sm text-gray-400">Count</th>
                <th className="text-right py-2 px-4 text-sm text-gray-400">Processing Time</th>
                <th className="text-right py-2 px-4 text-sm text-gray-400">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {constraintAnalysis.map((item, index) => (
                <tr key={index} className="border-b border-gray-600">
                  <td className="py-2 px-4">{item.type}</td>
                  <td className="text-right py-2 px-4 font-mono">{item.count}</td>
                  <td className="text-right py-2 px-4 font-mono">{item.time}</td>
                  <td className="text-right py-2 px-4">
                    <span className="text-purple-400">
                      {Math.round((item.count / 480) * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimization Suggestions */}
      {profileData && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
            Optimization Suggestions
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-yellow-400">⚠️</span>
              <div>
                <div className="font-medium">Reduce constraint count</div>
                <div className="text-sm text-gray-400">
                  Your circuit has {profileData.constraints} constraints. Consider optimizing algebraic expressions.
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-400">💡</span>
              <div>
                <div className="font-medium">Use batch operations</div>
                <div className="text-sm text-gray-400">
                  Combine multiple operations into batch computations to reduce FFT overhead.
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-400">✅</span>
              <div>
                <div className="font-medium">Memory usage is optimal</div>
                <div className="text-sm text-gray-400">
                  Your peak memory usage of {profileData.peakMemory}MB is within acceptable limits.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
