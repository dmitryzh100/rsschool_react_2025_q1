import { useState, useEffect } from 'react';

function useLocalStorage(
  key: string,
  defaultValue: string = ''
): [string, (value: string) => void] {
  const [searchTerm, setSearchTerm] = useState<string>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? storedValue : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, searchTerm);
  }, [key, searchTerm]);

  return [searchTerm, setSearchTerm];
}

export default useLocalStorage;
