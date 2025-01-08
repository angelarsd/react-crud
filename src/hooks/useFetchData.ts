import { useCallback, useState } from 'react';
import { useSnackbar } from '../contexts/SnackbarContext';
import { Data, getData } from '../api/data';

function useFetchData() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Data[]>([]);
  const { openSnackbar } = useSnackbar();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getData();
      setData(data);
      setIsLoading(false);
    } catch (error) {
      openSnackbar('Failed to fetch data', 'error');
      throw error;
    }
  }, [openSnackbar]);

  return { data, fetchData, isLoading };
}

export default useFetchData;
