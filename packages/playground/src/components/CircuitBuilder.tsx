import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  NodeTypes,
  Handle,
  Position,
} from 'react-flow-renderer';
import { Plus, Trash2, Save, Download, Zap } from 'lucide-react';

// Custom node types for ZK circuits
const nodeTypes: NodeTypes = {
  input: InputNode,
  operation: OperationNode,
  output: OutputNode,
  constraint: ConstraintNode,
};

function InputNode({ data }: { data: any }) {
  return (
    <div className="bg-green-900 border-2 border-green-500 rounded-lg p-3 min-w-[150px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-green-400">INPUT</span>
        <Zap className="w-3 h-3 text-green-400" />
      </div>
      <input
        type="text"
        value={data.label}
        onChange={(e) => data.onChange(e.target.value)}
        className="bg-green-800 text-white px-2 py-1 rounded text-sm w-full"
        placeholder="Field name"
      />
      <select
        value={data.type}
        onChange={(e) => data.onTypeChange(e.target.value)}
        className="bg-green-800 text-white px-2 py-1 rounded text-xs w-full mt-1"
      >
        <option value="secret">Secret</option>
        <option value="public">Public</option>
      </select>
      <Handle type="source" position={Position.Right} className="bg-green-500" />
    </div>
  );
}

function OperationNode({ data }: { data: any }) {
  return (
    <div className="bg-blue-900 border-2 border-blue-500 rounded-lg p-3 min-w-[150px]">
      <Handle type="target" position={Position.Left} className="bg-blue-500" />
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-blue-400">OPERATION</span>
        <Zap className="w-3 h-3 text-blue-400" />
      </div>
      <select
        value={data.operation}
        onChange={(e) => data.onOperationChange(e.target.value)}
        className="bg-blue-800 text-white px-2 py-1 rounded text-sm w-full"
      >
        <option value="add">Add (+)</option>
        <option value="multiply">Multiply (×)</option>
        <option value="subtract">Subtract (−)</option>
        <option value="divide">Divide (÷)</option>
        <option value="hash">Hash</option>
        <option value="compare">Compare</option>
      </select>
      <div className="text-xs text-blue-300 mt-1">{data.label}</div>
      <Handle type="source" position={Position.Right} className="bg-blue-500" />
    </div>
  );
}

function OutputNode({ data }: { data: any }) {
  return (
    <div className="bg-purple-900 border-2 border-purple-500 rounded-lg p-3 min-w-[150px]">
      <Handle type="target" position={Position.Left} className="bg-purple-500" />
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-purple-400">OUTPUT</span>
        <Zap className="w-3 h-3 text-purple-400" />
      </div>
      <input
        type="text"
        value={data.label}
        onChange={(e) => data.onChange(e.target.value)}
        className="bg-purple-800 text-white px-2 py-1 rounded text-sm w-full"
        placeholder="Output name"
      />
    </div>
  );
}

function ConstraintNode({ data }: { data: any }) {
  return (
    <div className="bg-orange-900 border-2 border-orange-500 rounded-lg p-3 min-w-[150px]">
      <Handle type="target" position={Position.Left} className="bg-orange-500" />
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-orange-400">CONSTRAINT</span>
        <Zap className="w-3 h-3 text-orange-400" />
      </div>
      <input
        type="text"
        value={data.constraint}
        onChange={(e) => data.onConstraintChange(e.target.value)}
        className="bg-orange-800 text-white px-2 py-1 rounded text-sm w-full"
        placeholder="e.g., x > 0"
      />
    </div>
  );
}

interface CircuitBuilderProps {
  onCircuitUpdate: (circuit: any) => void;
  currentCircuit: any;
}

export function CircuitBuilder({ onCircuitUpdate, currentCircuit }: CircuitBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const [selectedNodeType, setSelectedNodeType] = useState<string>('input');

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `node-${nodeIdCounter}`,
      type,
      position: { x: 250, y: 100 + nodeIdCounter * 100 },
      data: {
        label: `${type}-${nodeIdCounter}`,
        onChange: (value: string) => updateNodeData(`node-${nodeIdCounter}`, 'label', value),
        onTypeChange: (value: string) => updateNodeData(`node-${nodeIdCounter}`, 'type', value),
        onOperationChange: (value: string) => updateNodeData(`node-${nodeIdCounter}`, 'operation', value),
        onConstraintChange: (value: string) => updateNodeData(`node-${nodeIdCounter}`, 'constraint', value),
        type: type === 'input' ? 'secret' : undefined,
        operation: type === 'operation' ? 'add' : undefined,
        constraint: type === 'constraint' ? '' : undefined,
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter(nodeIdCounter + 1);
    
    // Update parent component
    onCircuitUpdate({ nodes: [...nodes, newNode], edges });
  };

  const updateNodeData = (nodeId: string, field: string, value: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              [field]: value,
            },
          };
        }
        return node;
      })
    );
  };

  const deleteSelectedNodes = () => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  };

  const saveCircuit = () => {
    const circuit = { nodes, edges };
    localStorage.setItem('zkCircuit', JSON.stringify(circuit));
    alert('Circuit saved to local storage!');
  };

  const loadCircuit = () => {
    const saved = localStorage.getItem('zkCircuit');
    if (saved) {
      const circuit = JSON.parse(saved);
      setNodes(circuit.nodes);
      setEdges(circuit.edges);
      onCircuitUpdate(circuit);
    }
  };

  const exportCircuit = () => {
    const circuit = { nodes, edges };
    const dataStr = JSON.stringify(circuit, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'zk-circuit.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-700 p-4 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <select
              value={selectedNodeType}
              onChange={(e) => setSelectedNodeType(e.target.value)}
              className="bg-gray-600 text-white px-3 py-2 rounded"
            >
              <option value="input">Input Node</option>
              <option value="operation">Operation Node</option>
              <option value="output">Output Node</option>
              <option value="constraint">Constraint Node</option>
            </select>
            <button
              onClick={() => addNode(selectedNodeType)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Node</span>
            </button>
            <button
              onClick={deleteSelectedNodes}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={saveCircuit}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={loadCircuit}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Load</span>
            </button>
            <button
              onClick={exportCircuit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Circuit Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#374151" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case 'input': return '#10b981';
                case 'operation': return '#3b82f6';
                case 'output': return '#a855f7';
                case 'constraint': return '#f97316';
                default: return '#6b7280';
              }
            }}
            style={{
              backgroundColor: '#1f2937',
            }}
          />
        </ReactFlow>
      </div>

      {/* Info Panel */}
      <div className="bg-gray-700 p-4 border-t border-gray-600">
        <div className="text-sm text-gray-300">
          <span className="font-semibold">Nodes:</span> {nodes.length} | 
          <span className="font-semibold ml-3">Edges:</span> {edges.length} | 
          <span className="ml-3">Drag nodes to reposition, click and drag from handles to connect</span>
        </div>
      </div>
    </div>
  );
}
