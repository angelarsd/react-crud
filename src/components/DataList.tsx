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
import { useNavigate, useLocation } from 'react-router-dom';
import Drawer from './Drawer';
import FormWithQueryParams from './FormWithQueryParams';
import FiltersWithPills from './FiltersWithPills';

const DataList: React.FC = () => {
  const { data, fetchData, isLoading } = useFetchData();
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialRowsPerPage = parseInt(searchParams.get('perPage') || '10', 10);

  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

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

  const updateURLParams = (newPage: number, newRowsPerPage: number) => {
    const params = new URLSearchParams(location.search);
    params.set('page', newPage.toString());
    params.set('perPage', newRowsPerPage.toString());
    navigate({ search: params.toString() }, { replace: true });
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage + 1);
    updateURLParams(newPage + 1, rowsPerPage);
  };

  const handleRowsPerPageChange = (event: { target: { value: string } }) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
    updateURLParams(1, newRowsPerPage);
  };

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
  const handleCreate = () => navigate('/add');

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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.pagination?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page - 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
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
