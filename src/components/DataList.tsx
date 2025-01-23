import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Skeleton,
  Typography,
  Container,
  Button,
  Box,
  TablePagination,
} from '@mui/material';
import {
  Edit,
  Delete,
  Female,
  Male,
  Add,
  FilterAlt,
} from '@mui/icons-material';
import { deleteData, FiltersData } from '../api/data';
import { useSnackbar } from '../contexts/SnackbarContext';
import ConfirmDialog from './ConfirmDialog';
import useFetchData from '../hooks/useFetchData';
import { useNavigate } from 'react-router-dom';
import Drawer from './Drawer';
import FormWithQueryParams from './FormWithQueryParams';
import FiltersWithPills from './FiltersWithPills';

const DataList: React.FC = () => {
  const { data, fetchData, isLoading } = useFetchData();
  const [page, setPage] = React.useState(0); // Página actual (comienza en 0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10); // Filas por página
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const filters = useMemo(() => {
    return Object.fromEntries(searchParams.entries()) as unknown as FiltersData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    fetchData(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await deleteData(selectedId);
        fetchData(filters);
        openSnackbar('Data deleted successfully', 'success');
      } catch (error) {
        openSnackbar('Failed to delete data', 'error');
        throw error;
      }
    }
  };

  const handleOpenDialog = (id: number) => () => {
    setOpen(true);
    setSelectedId(id);
  };

  const handleEdit = (id: number) => () => navigate(`/edit/${id}`);

  const handleCreate = () => {
    navigate('/add');
  };

  const handlePageChange = (_event, newPage: number) => {
    setPage(newPage);
    // Llama a tu servicio para obtener los datos de la nueva página
    fetchData({ ...filters, page: newPage + 1, perPage: rowsPerPage }); // `newPage + 1` porque el backend usa índice 1
  };

  const handleRowsPerPageChange = (event: { target: { value: string } }) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reinicia a la primera página
    fetchData({ ...filters, page: 1, perPage: newRowsPerPage });
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" component="h4">
          Data
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={handleCreate}
            startIcon={<Add />}
          >
            Create
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenDrawer(true)}
            startIcon={<FilterAlt />}
          >
            Filter
          </Button>
        </Box>
      </Box>
      <FiltersWithPills />
      <br />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Lastname</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? [...Array(10)].map((_, k) => (
                  <TableRow key={k}>
                    {[...Array(7)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="rectangular" height={25} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : data.result.map(
                  ({ id, name, lastname, age, gender, email }, key) => (
                    <TableRow key={key}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{name || ''}</TableCell>
                      <TableCell>{lastname || ''}</TableCell>
                      <TableCell>{age || ''}</TableCell>
                      <TableCell>
                        {gender &&
                          (gender === 'F' ? (
                            <Female sx={{ color: 'pink' }} />
                          ) : (
                            <Male sx={{ color: 'cyan' }} />
                          ))}
                      </TableCell>
                      <TableCell>{email && email}</TableCell>
                      <TableCell>
                        <IconButton onClick={handleEdit(id)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={handleOpenDialog(id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]} // Opciones de filas por página
          component="div"
          count={data.pagination?.total || 0} // Total de elementos
          rowsPerPage={rowsPerPage} // Filas por página actuales
          page={page} // Página actual
          onPageChange={handlePageChange} // Cambiar página
          onRowsPerPageChange={handleRowsPerPageChange} // Cambiar filas por página
          showFirstButton
          showLastButton
        />
      </TableContainer>
      <ConfirmDialog onConfirm={handleDelete} setOpen={setOpen} open={open} />
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Typography typography="h4">
          <FormWithQueryParams onSubmit={() => setOpenDrawer(false)} />
        </Typography>
      </Drawer>
    </Container>
  );
};

export default DataList;
