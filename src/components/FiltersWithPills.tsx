import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Chip } from '@mui/material';

// Define props for the component
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

  // Parse the current query parameters
  const searchParams = new URLSearchParams(location.search);
  const filters = Object.fromEntries(searchParams.entries());

  // Handle removing a filter
  const handleRemoveFilter = (key: string) => {
    // Remove the filter from the current query parameters
    searchParams.delete(key);
    const updatedFilters = Object.fromEntries(searchParams.entries());

    // Update the URL with the remaining filters
    navigate(`?${searchParams.toString()}`);

    // Call the optional callback for additional handling
    if (onRemoveFilter) {
      onRemoveFilter(key, updatedFilters);
    }
  };

  // Don't render anything if there are no filters applied
  if (Object.keys(filters).length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      {Object.entries(filters).map(([key, value]) => (
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
