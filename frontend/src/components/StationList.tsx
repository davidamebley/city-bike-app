import React, { useEffect, useState } from 'react';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TablePagination,
    TextField,
    TableSortLabel,
    CircularProgress
  } from '@mui/material';

import { SingleStationView } from './SingleStationView';
import '../styles/stationList.css';

interface Station {
  _id: string;
  name: string;
}

const fetchStations = async (
    serverUrl: string,
    page: number,
    limit: number,
    search: string,
    setStations: React.Dispatch<React.SetStateAction<Station[]>>,
    setTotalCount: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const response = await fetch(
      `${serverUrl}/api/stations?page=${page}&limit=${limit}&search=${search}`
    );
    const data = await response.json();
    setStations(data.stations);
    setTotalCount(data.totalCount);
  };

export const StationList: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const serverUrl = process.env.REACT_APP_SERVER_URL!;

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching data
    fetchStations(serverUrl, page, limit, search, setStations, setTotalCount)
    .then(() => setLoading(false)); // Set loading to false when data is fetched
  }, [page, limit, search, serverUrl]);

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null, newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className='container__station-list'>
      <h2 className='header__stations'>Bicycle Stations</h2>
      <div className='station-search-field'>
      <TextField
        label="Search"
        placeholder="Search station name"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      </div>
      {loading ? (
        <div className="spinner" >
          <CircularProgress />
        </div>

      ) : (
        <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>
                <TableSortLabel>
                  Station ID
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                <TableSortLabel>
                  Station Name
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stations.map((station, index) => (
              <TableRow key={index}>
                <TableCell>{station._id}</TableCell>
                <TableCell>{station.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )}
      <TablePagination
        count={totalCount}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={limit}
        onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </div>
  );
};