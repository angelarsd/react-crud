import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  onConfirm: () => void | Promise<void>;
  open: boolean;
  setOpen: (show: boolean) => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onConfirm,
  setOpen,
}) => {
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
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
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmDialog;
