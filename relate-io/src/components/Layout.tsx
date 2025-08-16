import React from 'react';
import Editor from './Editor';
import Diagram from './Diagram';
import SettingsPanel from './SettingsPanel';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <SettingsPanel />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <Editor />
          <Diagram />
        </div>
      </main>
    </div>
  );
};

export default Layout;
