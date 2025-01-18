import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, MenuItem, Typography, Box } from '@mui/material';

// Define the shape of the form data
interface FormData {
  name: string;
  lastname: string;
  age: string;
  gender: string;
  email: string;
}

// Define props for the component
interface FormWithQueryParamsProps {
  onSubmit?: (data: Partial<FormData>) => void;
}

const FormWithQueryParams: React.FC<FormWithQueryParamsProps> = ({
  onSubmit,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    lastname: '',
    age: '',
    gender: '',
    email: '',
  });

  const genders = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
  ];

  // Load query params into the form on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const initialData: Partial<FormData> = {};
    for (const [key, value] of searchParams.entries()) {
      initialData[key as keyof FormData] = value;
    }
    setFormData((prev) => ({ ...prev, ...initialData }));
  }, [location.search]);

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Filter out fields with empty values
    const filteredData = Object.entries(formData)
      .filter(([_, value]) => value)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    // Update URL with filtered query parameters
    const queryParams = new URLSearchParams(filteredData).toString();
    navigate(`?${queryParams}`);

    // Call the onSubmit prop if provided
    if (onSubmit) {
      onSubmit(filteredData);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" component="h5" mb={2}>
        Formulario con QueryParams
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            {genders.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default FormWithQueryParams;
