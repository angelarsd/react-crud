import { useCallback, useState } from 'react';
import { useSnackbar } from '../contexts/SnackbarContext';
import { getDataById } from '../api/data';

function useFetchDataById() {
  const [isLoading, setIsLoading] = useState(false);
  const { openSnackbar } = useSnackbar();

  const fetchDataById = useCallback(
    async (id: number) => {
      try {
        setIsLoading(true);
        const data = await getDataById(id);
        setIsLoading(false);
        return data;
      } catch (error) {
        openSnackbar('Failed to fetch data', 'error');
        throw error;
      }
    },
    [openSnackbar]
  );

  return { fetchDataById, isLoading };
}

export default useFetchDataById;
