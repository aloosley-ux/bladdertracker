import { useContext } from 'react';
import { AppContext, type AppContextType } from './appContextDef';

// useApp — hook to access app state and CRUD operations from AppContext.
export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
