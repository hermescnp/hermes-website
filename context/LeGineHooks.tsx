import { useState, useEffect } from 'react';

function useHistory(): [string[], (item: string) => void, () => void, () => void, () => string] {
    const [history, setHistory] = useState<string[]>(['main']);
  
    const pushToHistory = (item: string) => {
      setHistory((prevHistory) => {
        // If the last item in the history is the same as the new item, don't push the new item.
        if (prevHistory[prevHistory.length - 1] === item) {
          return prevHistory;
        }
        return [...prevHistory, item];
      });
    };

    const stepBackHistory = () => {
        setHistory((prevHistory) => {
          if (prevHistory.length > 0) {
            return prevHistory.slice(0, -1);  // Removes the last element from the array
          }
          return prevHistory; // Returns the array unchanged if it's empty
        });
    };
  
    const clearHistory = () => {
      setHistory([]);
    };

    const getLastHistoryItem = (): string => {
      if (history.length > 0) {
          return history[history.length - 1];
      }
      return ('root');
    }
  
    return [history, pushToHistory, stepBackHistory, clearHistory, getLastHistoryItem];
}

export default useHistory;
