import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';

interface ConfirmDialogProps {
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  open: boolean;
  setOpen: (show: boolean) => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onConfirm,
  onCancel,
  setOpen,
}) => {
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const handleConfirm = async () => {
    setIsConfirmLoading(true);
    await onConfirm();
    setIsConfirmLoading(false);
    setOpen(false);
  };

  const handleClose = () => setOpen(false);

  const handleCancel = async () => {
    setIsCancelLoading(true);
    if (onCancel !== undefined) {
      await onCancel();
    }
    setIsCancelLoading(false);
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to proceed with this action?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={isCancelLoading || isConfirmLoading}
            startIcon={
              isCancelLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isCancelLoading || isConfirmLoading}
            startIcon={
              isConfirmLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmDialog;
