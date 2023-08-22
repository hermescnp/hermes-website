import { useState, useEffect } from 'react';

function useHistory(): [string[], (item: string) => void, () => void, () => void] {
    const [history, setHistory] = useState<string[]>(['main']);
  
    const pushToHistory = (item: string) => {
      setHistory((prevHistory) => [...prevHistory, item]);
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
  
    return [history, pushToHistory, stepBackHistory, clearHistory];
}

export default useHistory;
