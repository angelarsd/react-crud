import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createData, Data, updateData } from '../api/data';
import { useSnackbar } from '../contexts/SnackbarContext';
import useFetchDataById from '../hooks/useFetchDataById';

const MyForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { fetchDataById, isLoading } = useFetchDataById();
  const [formData, setFormData] = useState<Omit<Data, 'id'>>({
    name: '',
    lastname: '',
    age: null,
    gender: '',
    email: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isEdit) {
        const data = await fetchDataById(Number(id));
        setFormData(data);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsUpdating(true);
      if (isEdit) {
        await updateData(Number(id), formData);
      } else {
        await createData(formData);
      }
      setIsUpdating(false);
      navigate('/');
      openSnackbar(
        `Data ${isEdit ? 'updated' : 'created'} successfully`,
        'success'
      );
    } catch (error) {
      openSnackbar(`Failed to ${isEdit ? 'update' : 'create'} data`, 'error');
      throw error;
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <Typography variant="h5" gutterBottom>
        {isEdit ? 'Edit Data' : 'Add Data'}
      </Typography>
      {isLoading ? (
        <>
          <Skeleton variant="rectangular" width="100%" height={56} />
          <Skeleton variant="rectangular" width="100%" height={56} />
          <Skeleton variant="rectangular" width="100%" height={56} />
          <Skeleton variant="rectangular" width="100%" height={56} />
          <Skeleton variant="rectangular" width="100%" height={56} />
        </>
      ) : (
        <>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            type="number"
            inputProps={{ min: 0 }} // Validación de número no negativo
          />
          <TextField
            select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="M">Male</MenuItem>
            <MenuItem value="F">Female</MenuItem>
          </TextField>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            type="email"
          />
        </>
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          fullWidth
          disabled={isUpdating || isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isUpdating || isLoading}
          startIcon={
            isUpdating ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default MyForm;
