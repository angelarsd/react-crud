import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { Edit, Delete, Female, Male } from '@mui/icons-material';
import { deleteData } from '../api/data';
import { useSnackbar } from '../contexts/SnackbarContext';
import ConfirmDialog from './ConfirmDialog';
import useFetchData from '../hooks/useFetchData';
import { useNavigate } from 'react-router-dom';

const DataList: React.FC = () => {
  const { data, fetchData, isLoading } = useFetchData();
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await deleteData(selectedId);
        fetchData();
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

  return (
    <Container>
      <Typography typography="h4">Data</Typography>
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
              ? [...Array(5)].map((_, k) => (
                  <TableRow key={k}>
                    {[...Array(7)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="rectangular" height={25} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : data.map(({ id, name, lastname, age, gender, email }, key) => (
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
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog onConfirm={handleDelete} setOpen={setOpen} open={open} />
    </Container>
  );
};

export default DataList;
