import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Node, Edge } from 'reactflow';
import { RootState } from '../store/store';
import { parse, ParsedER } from '../parser/parser';
import { setParsedData } from '../store/diagramSlice';

// This hook encapsulates the logic for parsing the raw text and converting it into nodes and edges for React Flow.
export const useDiagram = () => {
  const dispatch = useDispatch();
  const rawText = useSelector((state: RootState) => state.diagram.rawText);

  // Parse the raw text whenever it changes and store the result in Redux.
  useEffect(() => {
    try {
      const parsedData = parse(rawText);
      dispatch(setParsedData(parsedData));
    } catch (error) {
      console.error("Failed to parse diagram syntax:", error);
      // Here you could dispatch an action to store the parsing error state
    }
  }, [rawText, dispatch]);

  const parsedData = useSelector((state: RootState) => state.diagram.parsedData);

  // Memoize the transformation from parsed data to nodes and edges to avoid re-calculating on every render.
  const { nodes, edges } = useMemo(() => {
    if (!parsedData) {
      return { nodes: [], edges: [] };
    }

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    let yPos = 0;
    let xPos = 0;
    const nodeWidth = 200;
    const nodeHeight = 150;
    const horizontalGap = 50;
    const verticalGap = 50;

    // A very basic auto-layout algorithm.
    Object.values(parsedData.entities).forEach((entity, index) => {
      newNodes.push({
        id: entity.name,
        type: 'default', // In the future, we can use custom nodes to display attributes.
        data: { label: `${entity.name}` },
        position: { x: xPos, y: yPos },
        style: { width: nodeWidth, minHeight: nodeHeight },
      });
      xPos += nodeWidth + horizontalGap;
      if ((index + 1) % 4 === 0) { // Wrap to next row after 4 nodes
        xPos = 0;
        yPos += nodeHeight + verticalGap;
      }
    });

    parsedData.relationships.forEach((rel, index) => {
      newEdges.push({
        id: `e-${rel.fromEntity}-${rel.toEntity}-${index}`,
        source: rel.fromEntity,
        target: rel.toEntity,
        type: 'smoothstep',
        animated: true,
        label: rel.type,
      });
    });

    return { nodes: newNodes, edges: newEdges };
  }, [parsedData]);

  return { nodes, edges };
};
