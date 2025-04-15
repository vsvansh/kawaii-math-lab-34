
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HistoryItem {
  input: string;
  result: string;
  timestamp: number;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onHistoryItemClick: (input: string) => void;
  onClearHistory: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onHistoryItemClick,
  onClearHistory,
}) => {
  return (
    <div className="kawaii-card h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-kawaii-purple-dark dark:text-kawaii-purple-light">
          History
        </h3>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs px-2 py-1 rounded-md bg-kawaii-peach-light text-kawaii-peach-dark hover:bg-kawaii-peach transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <ScrollArea className="flex-1 pr-3">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <p className="text-sm">No calculations yet</p>
            <p className="text-xs mt-1">Your history will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={index}
                onClick={() => onHistoryItemClick(item.input)}
                className="kawaii-history-item transition-all hover:translate-y-[-2px]"
              >
                <div className="text-xs text-muted-foreground">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
                <div className="font-medium">{item.input}</div>
                <div className="text-right font-bold">{item.result}</div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default HistoryPanel;
