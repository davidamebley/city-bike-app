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

import '../styles/journeyList.css';

interface Journey {
  departure: string;
  return: string;
  departure_station_name: string;
  return_station_name: string;
  covered_distance: number;
  duration: number;
}

const fetchJourneys = async (
  serverUrl: string,
  page: number,
  limit: number,
  search: string,
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  setJourneys: React.Dispatch<React.SetStateAction<Journey[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>
) => {
  const response = await fetch(
    `${serverUrl}/api/journeys?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  );
  const data = await response.json();
  setJourneys(data.journeys);
  setTotalCount(data.totalCount);
};

export const JourneyList: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('departure_station_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const serverUrl = process.env.REACT_APP_SERVER_URL!;

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching data
    fetchJourneys(serverUrl, page, limit, search, sortBy, sortOrder, setJourneys, setTotalCount)
    .then(() => setLoading(false)); // Set loading to false when data is fetched
  }, [page, limit, search, sortBy, sortOrder, serverUrl]);

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

  const handleSort = (column: string) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className='container__journey-list'>
      <h2 className='header__journeys'>Journeys</h2>
      <div className='journey-search-field'>
      <TextField
        label="Search"
        placeholder="Search departure or return station"
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
                <TableSortLabel
                  active={sortBy === 'departure_station_name'}
                  direction={sortOrder}
                  onClick={() => handleSort('departure_station_name')}
                >
                  Departure Station
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                <TableSortLabel
                  active={sortBy === 'return_station_name'}
                  direction={sortOrder}
                  onClick={() => handleSort('return_station_name')}
                >
                  Return Station
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                  active={sortBy === 'covered_distance'}
                  direction={sortOrder}
                  onClick={() => handleSort('covered_distance')}
                >
                  Distance Covered (km)
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                <TableSortLabel
                  active={sortBy === 'duration'}
                  direction={sortOrder}
                  onClick={() => handleSort('duration')}
                >
                  Duration (mins)
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {journeys.map((journey, index) => (
              <TableRow key={index}>
                <TableCell>{journey.departure_station_name}</TableCell>
                <TableCell>{journey.return_station_name}</TableCell>
                <TableCell>{journey.covered_distance / 1000}</TableCell>
                <TableCell>{journey.duration / 60}</TableCell>
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

               
