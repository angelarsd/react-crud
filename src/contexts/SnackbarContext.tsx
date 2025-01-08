// SnackbarContext.tsx
import { createContext, useState, ReactNode, useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarContextType {
  openSnackbar: (message: string, severity: 'success' | 'error') => void;
  closeSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');

  const openSnackbar = (message: string, severity: 'success' | 'error') => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  const closeSnackbar = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
