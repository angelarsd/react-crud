import { Drawer as MuiDrawer, useMediaQuery, useTheme } from '@mui/material';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

const Drawer = ({ open, onClose, children, width = 500 }: DrawerProps) => {
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('sm'));

  return (
    <MuiDrawer
      anchor={isMobile ? 'bottom' : 'right'}
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: isMobile ? '100%' : width,
          height: '100%',
        },
      }}
    >
      {children}
    </MuiDrawer>
  );
};

export default Drawer;
