
import React from 'react';

interface MemoryPanelProps {
  memory: string | null;
  onMemoryRecall: () => void;
  onMemoryClear: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
}

const MemoryPanel: React.FC<MemoryPanelProps> = ({
  memory,
  onMemoryRecall,
  onMemoryClear,
  onMemoryAdd,
  onMemorySubtract,
}) => {
  return (
    <div className="flex space-x-2 my-2">
      <button
        onClick={onMemoryRecall}
        disabled={!memory}
        className={`kawaii-btn px-2 py-1 text-xs ${
          memory 
            ? 'bg-kawaii-blue-light text-kawaii-blue-dark hover:bg-kawaii-blue' 
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        MR
      </button>
      <button
        onClick={onMemoryClear}
        disabled={!memory}
        className={`kawaii-btn px-2 py-1 text-xs ${
          memory 
            ? 'bg-kawaii-peach-light text-kawaii-peach-dark hover:bg-kawaii-peach' 
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        MC
      </button>
      <button
        onClick={onMemoryAdd}
        className="kawaii-btn px-2 py-1 text-xs bg-kawaii-mint-light text-kawaii-mint-dark hover:bg-kawaii-mint"
      >
        M+
      </button>
      <button
        onClick={onMemorySubtract}
        className="kawaii-btn px-2 py-1 text-xs bg-kawaii-purple-light text-kawaii-purple-dark hover:bg-kawaii-purple"
      >
        M-
      </button>
      {memory && (
        <div className="kawaii-btn px-2 py-1 text-xs bg-kawaii-yellow-light text-kawaii-yellow-dark">
          M: {memory}
        </div>
      )}
    </div>
  );
};

export default MemoryPanel;
