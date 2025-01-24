import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Chip } from '@mui/material';

interface FiltersWithPillsProps {
  onRemoveFilter?: (
    key: string,
    updatedFilters: Record<string, string>
  ) => void;
}

const FiltersWithPills: React.FC<FiltersWithPillsProps> = ({
  onRemoveFilter,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const filters = Object.fromEntries(searchParams.entries());

  const handleRemoveFilter = (key: string) => {
    searchParams.delete(key);
    const updatedFilters = Object.fromEntries(searchParams.entries());

    navigate(`?${searchParams.toString()}`);

    if (onRemoveFilter) {
      onRemoveFilter(key, updatedFilters);
    }
  };

  if (Object.keys(filters).length === 0) {
    return null;
  }

  const skipPagination = ([key]: [string, string]) =>
    key !== 'page' && key !== 'perPage';

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      {Object.entries(filters)
        .filter(skipPagination)
        .map(([key, value]) => (
          <Chip
            key={key}
            label={`${key}: ${value}`}
            onDelete={() => handleRemoveFilter(key)}
            sx={{ m: 0.5 }}
            color="primary"
            variant="outlined"
          />
        ))}
    </Box>
  );
};

export default FiltersWithPills;
