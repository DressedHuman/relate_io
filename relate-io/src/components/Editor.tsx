import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MonacoEditor from '@monaco-editor/react';
import { setRawText } from '../store/diagramSlice';
import { RootState } from '../store/store';

const Editor: React.FC = () => {
  const dispatch = useDispatch();
  const rawText = useSelector((state: RootState) => state.diagram.rawText);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      dispatch(setRawText(value));
    }
  };

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <MonacoEditor
        height="100%"
        language="plaintext" // We can define a custom language later
        theme="vs-dark"
        value={rawText}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          lineNumbers: 'on',
        }}
      />
    </div>
  );
};

export default Editor;
