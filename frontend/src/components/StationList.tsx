import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
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
    CircularProgress,
    Alert,
    Button
  } from '@mui/material';

import { SingleStationView } from './SingleStationView';
import '../styles/stationList.css';
import { AddStationDialog } from './AddStationDialog';

interface Station {
  _id: string;
  name: string;
  address: string;
}

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const fetchStations = async (
    serverUrl: string,
    page: number,
    limit: number,
    search: string,
    setStations: React.Dispatch<React.SetStateAction<Station[]>>,
    setTotalCount: React.Dispatch<React.SetStateAction<number>>
  ) => {
    try {
      const requestUrl = `${serverUrl}/api/stations?page=${page}&limit=${limit}&search=${encodeURIComponent(escapeRegExp(search))}`;
      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStations(data.stations);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
};
  
  

export const StationList: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500); // 500ms debounce delay
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const serverUrl = process.env.REACT_APP_SERVER_URL!;

  useEffect(() => {
    setLoading(true);
    (async () => {
      await fetchStations(serverUrl, page, limit, search, setStations, setTotalCount);
      setLoading(false);
    })();
  }, [page, limit, debouncedSearch, serverUrl]);

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

  const handleAddStation = async (name: string, address: string, lat: number, lng: number) => {
    const response = await fetch(`${serverUrl}/api/stations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, address, x:lng, y:lat }),  //x:lng; y:lat
    });

    if (response.ok) {
      setPage(1);
      setSearch('');
      setModalOpen(false);
      setErrorMessage(null);
      setSuccessMessage('New station added successfully.'); 
      
      // Refetch the stations after successfully adding a new station
      setLoading(true);
      await fetchStations(serverUrl, page, limit, search, setStations, setTotalCount);
      setLoading(false);
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.error || 'An error occurred while saving the station data');
    }
  };

  return (
    <>
      {selectedStation ? (
          <SingleStationView
            stationId={selectedStation}
            onBack={() => setSelectedStation(null)}
          />
        ) : (
          <div className='container__station-list'>
            <div className="station-list--action-area">
              <div className='station-search-field'>
                  <TextField
                      label="Search"
                      placeholder="Search station"
                      fullWidth
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                  />
              </div>
              <div className='add-station-button'>
                <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
                    Add Station
                </Button>
              </div>
            </div>

              {errorMessage && (
                <div className="error-message">
                  <Alert severity="error">{errorMessage}</Alert>
                </div>
              )}
              {successMessage && (
                <div className="success-message">
                  <Alert severity="success">{successMessage}</Alert>
                </div>
              )}

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
                                      Station ID
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 'bold' }} className='fixedWidthCol2'>
                                      Station Name
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 'bold' }} className='fixedWidthCol2'>
                                      Station Address
                                  </TableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              {stations.map((station, index:number) => (
                              <TableRow className='station-list-item'
                                  key={index}
                                  onClick={() => setSelectedStation(station._id)}>
                                  <TableCell 
                                      className='fixedWidthCol1'>{station._id}
                                  </TableCell>
                                  <TableCell 
                                      className='fixedWidthCol2'>{station.name}
                                  </TableCell>
                                  <TableCell 
                                      className='fixedWidthCol2'>{station.address}
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
          )
      }
          </div>
        )
      }
      <AddStationDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddStation}
      />
    </>
  );
};