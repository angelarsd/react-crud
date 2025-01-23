import { useCallback, useState } from 'react';
import { useSnackbar } from '../contexts/SnackbarContext';
import { DataPagination, FiltersData, getData } from '../api/data';

function useFetchData() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DataPagination>({
    result: [],
  });
  const { openSnackbar } = useSnackbar();

  const fetchData = useCallback(
    async (filters: FiltersData | undefined) => {
      try {
        setIsLoading(true);
        const data = await getData(filters);
        setData(data);
        setIsLoading(false);
      } catch (error) {
        openSnackbar('Failed to fetch data', 'error');
        throw error;
      }
    },
    [openSnackbar]
  );

  return { data, fetchData, isLoading };
}

export default useFetchData;
