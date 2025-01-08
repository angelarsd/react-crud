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
import { getData, deleteData, Data } from '../api/data';

const DataList: React.FC = () => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchDatas();
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchDatas = async () => {
    const data = await getData();
    setData(data);
  };

  const handleDelete = async (id: string) => {
    await deleteData(id);
    fetchDatas();
  };

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
            {loading
              ? [...Array(5)].map((_, key) => (
                  <TableRow key={key}>
                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={25}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={25}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={25}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={25}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={25}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={25}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={25}
                      />
                    </TableCell>
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
                      <IconButton onClick={() => null}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DataList;
