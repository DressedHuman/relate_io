import React from 'react';
import ReactFlow, { Controls, Background, MiniMap, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css'; // Import React Flow styles
import { useDiagram } from '../hooks/useDiagram';

const Diagram: React.FC = () => {
  const { nodes, edges } = useDiagram();

  // This is a key piece for React Flow to re-render when nodes/edges change.
  const nodeTypes = React.useMemo(() => ({}), []);

  return (
    <div className="w-full h-full bg-gray-200 rounded-lg shadow-inner">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gradient-to-br from-gray-50 to-gray-200"
      >
        <Controls />
        <MiniMap nodeColor={(n: Node) => n.style?.background || '#fff'} nodeStrokeWidth={3} />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Diagram;
