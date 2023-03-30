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
    const requestUrl = `${serverUrl}/api/stations?page=${page}&limit=${limit}&search=${search}`;
    const response = await fetch(requestUrl);
    const data = await response.json();
    setStations(data.stations);
    setTotalCount(data.totalCount);
};
  
  

export const StationList: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const serverUrl = process.env.REACT_APP_SERVER_URL!;

  useEffect(() => {
    setLoading(true);
    (async () => {
      await fetchStations(serverUrl, page, limit, search, setStations, setTotalCount);
      setLoading(false);
    })();
  }, [page, limit, search, serverUrl]);
  
  

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <>
    {selectedStation ? (
        <SingleStationView
          stationId={selectedStation}
          onBack={() => setSelectedStation(null)}
        />
      ) : (
        loading ? (
            <div className="spinner" >
              <CircularProgress />
            </div>
    
          ) : (
            <div className='container__station-list'>
                <h2 className='header__stations'>Bicycle Stations</h2>
                <div className='station-search-field'>
                    <TextField
                        label="Search"
                        placeholder="Search station"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }} className='fixedWidthCol1'>
                                    Station ID
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} className='fixedWidthCol2'>
                                    Station Name
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stations.map((station, index) => (
                            <TableRow 
                                key={index}
                                onClick={() => setSelectedStation(station._id)}>
                                <TableCell className='fixedWidthCol1'>{station._id}</TableCell>
                                <TableCell className='fixedWidthCol2'>{station.name}</TableCell>
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
      </div>
          ))}
    
    </>
  );
};