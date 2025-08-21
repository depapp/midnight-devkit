import React from 'react';
import { BookOpen, Code, Shield, Coins, Users, Hash, ArrowRight } from 'lucide-react';

interface Example {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  circuit: any;
  code: string;
}

const examples: Example[] = [
  {
    id: 'basic-proof',
    title: 'Basic Proof of Knowledge',
    description: 'Simple circuit demonstrating proof of knowledge of a secret value',
    icon: Shield,
    difficulty: 'Beginner',
    circuit: { nodes: [], edges: [] },
    code: `// Basic Proof of Knowledge
contract ProofOfKnowledge {
  secret value: Field;
  public hash: Field;
  
  export function prove(): Bool {
    // Prove knowledge of value whose hash equals public hash
    let computed = hash(value);
    return computed == hash;
  }
}`,
  },
  {
    id: 'private-transfer',
    title: 'Private Token Transfer',
    description: 'Privacy-preserving token transfer with hidden amounts',
    icon: Coins,
    difficulty: 'Intermediate',
    circuit: { nodes: [], edges: [] },
    code: `// Private Token Transfer
contract PrivateTransfer {
  secret sender_balance: Field;
  secret receiver_balance: Field;
  secret transfer_amount: Field;
  public commitment: Field;
  
  export function transfer(): Bool {
    // Verify sender has sufficient balance
    assert(sender_balance >= transfer_amount);
    
    // Update balances
    let new_sender = sender_balance - transfer_amount;
    let new_receiver = receiver_balance + transfer_amount;
    
    // Verify commitment
    let computed = hash(new_sender, new_receiver);
    return computed == commitment;
  }
}`,
  },
  {
    id: 'merkle-proof',
    title: 'Merkle Tree Membership',
    description: 'Prove membership in a Merkle tree without revealing the element',
    icon: Hash,
    difficulty: 'Advanced',
    circuit: { nodes: [], edges: [] },
    code: `// Merkle Tree Membership Proof
contract MerkleProof {
  secret leaf: Field;
  secret path: Field[8];
  public root: Field;
  public index: Field;
  
  export function verify(): Bool {
    let current = hash(leaf);
    let idx = index;
    
    for (let i = 0; i < 8; i++) {
      if (idx % 2 == 0) {
        current = hash(current, path[i]);
      } else {
        current = hash(path[i], current);
      }
      idx = idx / 2;
    }
    
    return current == root;
  }
}`,
  },
  {
    id: 'age-verification',
    title: 'Age Verification',
    description: 'Prove age is above threshold without revealing exact age',
    icon: Users,
    difficulty: 'Beginner',
    circuit: { nodes: [], edges: [] },
    code: `// Age Verification without Disclosure
contract AgeVerification {
  secret birthYear: Field;
  secret currentYear: Field;
  public minAge: Field;
  
  export function verifyAge(): Bool {
    let age = currentYear - birthYear;
    return age >= minAge;
  }
  
  export function proveAdult(): Bool {
    let age = currentYear - birthYear;
    return age >= 18;
  }
}`,
  },
  {
    id: 'range-proof',
    title: 'Range Proof',
    description: 'Prove a value is within a specific range without revealing it',
    icon: Code,
    difficulty: 'Intermediate',
    circuit: { nodes: [], edges: [] },
    code: `// Range Proof
contract RangeProof {
  secret value: Field;
  public min: Field;
  public max: Field;
  public commitment: Field;
  
  export function proveInRange(): Bool {
    // Verify value is in range [min, max]
    assert(value >= min);
    assert(value <= max);
    
    // Verify commitment to the value
    let computed = hash(value);
    return computed == commitment;
  }
}`,
  },
];

interface ExampleGalleryProps {
  onSelectExample: (example: Example) => void;
}

export function ExampleGallery({ onSelectExample }: ExampleGalleryProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-900';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-900';
      case 'Advanced': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  return (
    <div className="h-full p-6 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Example Gallery</h2>
        <p className="text-gray-400">
          Explore pre-built examples to learn how to create zero-knowledge proofs with Midnight
        </p>
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((example) => {
          const Icon = example.icon;
          return (
            <div
              key={example.id}
              className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-all cursor-pointer group"
              onClick={() => onSelectExample(example)}
            >
              {/* Icon and Title */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-purple-900 transition-colors">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
                <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(example.difficulty)}`}>
                  {example.difficulty}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{example.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{example.description}</p>

              {/* Action */}
              <div className="flex items-center text-purple-400 group-hover:text-purple-300">
                <span className="text-sm font-medium">Load Example</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Categories */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Learn by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition-colors">
            <BookOpen className="w-5 h-5 text-blue-400 mb-2" />
            <div className="font-medium">Basics</div>
            <div className="text-xs text-gray-400">Fundamental concepts</div>
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition-colors">
            <Shield className="w-5 h-5 text-green-400 mb-2" />
            <div className="font-medium">Privacy</div>
            <div className="text-xs text-gray-400">Data protection</div>
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition-colors">
            <Coins className="w-5 h-5 text-yellow-400 mb-2" />
            <div className="font-medium">DeFi</div>
            <div className="text-xs text-gray-400">Financial applications</div>
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition-colors">
            <Users className="w-5 h-5 text-purple-400 mb-2" />
            <div className="font-medium">Identity</div>
            <div className="text-xs text-gray-400">Verification systems</div>
          </button>
        </div>
      </div>

      {/* Resources */}
      <div className="mt-12 bg-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Additional Resources</h3>
        <div className="space-y-3">
          <a href="#" className="flex items-center justify-between p-3 bg-gray-800 rounded hover:bg-gray-600 transition-colors">
            <span>📚 Midnight Documentation</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 bg-gray-800 rounded hover:bg-gray-600 transition-colors">
            <span>🎓 ZK Proof Tutorial Series</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 bg-gray-800 rounded hover:bg-gray-600 transition-colors">
            <span>💬 Community Discord</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
