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
  CircularProgress,
  Slider
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
  minDistance: number,
  maxDistance: number,
  minDuration: number,
  maxDuration: number,
  setJourneys: React.Dispatch<React.SetStateAction<Journey[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  setMaxDuration: React.Dispatch<React.SetStateAction<number>>,
  setMaxDistance: React.Dispatch<React.SetStateAction<number>>
) => {
  const response = await fetch(
    `${serverUrl}/api/journeys?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}&minDistance=${minDistance}&maxDistance=${maxDistance}&minDuration=${minDuration}&maxDuration=${maxDuration}`
  );
  const data = await response.json();
  setJourneys(data.journeys);
  setTotalCount(data.totalCount);
  setMaxDuration(data.maxDuration);
  setMaxDistance(data.maxDistance);
};

export const JourneyList: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('departure_station_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [maxDuration, setMaxDuration] = useState<number>(300);
  const [maxDistance, setMaxDistance] = useState<number>(100);
  const [distanceRange, setDistanceRange] = useState<[number, number]>([0, 100]);
  const [durationRange, setDurationRange] = useState<[number, number]>([0, 300]);
  const [loading, setLoading] = useState(true);
  const serverUrl = process.env.REACT_APP_SERVER_URL!;

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching data
    fetchJourneys(
      serverUrl, 
      page, 
      limit, 
      search, 
      sortBy, 
      sortOrder, 
      distanceRange[0],
      distanceRange[1],
      durationRange[0],
      durationRange[1],
      setJourneys, 
      setTotalCount,
      setMaxDuration,
      setMaxDistance
      ).then(() => setLoading(false)); // Set loading to false when data is fetched
  }, [page, limit, search, sortBy, sortOrder, serverUrl, distanceRange, durationRange]);

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null, newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
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
      <div className="container__journey-action-area">
        <div className='journey-search-field'>
          <TextField
            label="Search"
            placeholder="Search departure or return station"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="container__journey-filter">
          <h3>Refine results:</h3>
          <div className="journey-filter-list">
            <div className="journey-filter-field">
              <label htmlFor="distance-slider">Distance range (km):</label>
              <Slider
                id="distance-slider"
                min={0}
                max={parseInt(maxDistance.toFixed(0))}
                step={1}
                value={distanceRange}
                onChange={(_, value) => setDistanceRange(value as [number, number])}
                valueLabelDisplay="auto"
              />
            </div>
            <div className="journey-filter-field">
              <label htmlFor="duration-slider">Duration range (mins):</label>
              <Slider
                id="duration-slider"
                min={0}
                max={parseInt(maxDuration.toFixed(0))}
                step={1}
                value={durationRange}
                onChange={(_, value) => setDurationRange(value as [number, number])}
                valueLabelDisplay="auto"
              />
            </div>
          </div>
        </div>
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
              <TableCell sx={{ fontWeight: 'bold' }} className='fixedWidthCol1'>
                <TableSortLabel
                  active={sortBy === 'departure_station_name'}
                  direction={sortOrder}
                  onClick={() => handleSort('departure_station_name')}
                >
                  Departure Station
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} className='fixedWidthCol1'>
                <TableSortLabel
                  active={sortBy === 'return_station_name'}
                  direction={sortOrder}
                  onClick={() => handleSort('return_station_name')}
                >
                  Return Station
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} className='fixedWidthCol2'>
              <TableSortLabel
                  active={sortBy === 'covered_distance'}
                  direction={sortOrder}
                  onClick={() => handleSort('covered_distance')}
                >
                  Distance Covered (km)
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} className='fixedWidthCol2'>
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
              <TableRow className='journey-list-item' key={index}>
                <TableCell className='fixedWidthCol1'>{
                  journey.departure_station_name}
                </TableCell>
                <TableCell className='fixedWidthCol1'>{
                  journey.return_station_name}
                </TableCell>
                <TableCell className='fixedWidthCol2'>{
                  (journey.covered_distance / 1000).toFixed(3)} km
                </TableCell>
                <TableCell className='fixedWidthCol2'>{
                  (journey.duration / 60).toFixed(2)} mins
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableBody>
            <TableRow>
                <TablePagination
                    count={totalCount}
                    page={page - 1}
                    onPageChange={(_, newPage) => handlePageChange(null, newPage + 1)}
                    rowsPerPage={limit}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </div>
  );
};

               
