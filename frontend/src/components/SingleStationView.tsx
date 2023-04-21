import { useEffect, useState } from 'react';
import { Button, CircularProgress, ListItemIcon } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import '../styles/singleStationView.css';
import StationMap from './StationMap';
import { MapModal } from './MapModal';
// 
interface Station {
    _id: string
    name: string;
    address: string;
    x: number;
    y: number;
    journeysStarting: number;
    journeysEnding: number;
}

interface Location {
    latitude: number;
    longitude: number;   
}
const defaultCenter:Location = {
  latitude: 60.1699,
  longitude: 24.9384,
};

interface SingleStationViewProps {
  stationId: string;
  onBack: ()=>void;
}

const fetchStation = async (
    serverUrl: string,
    id: string,
    setStation: React.Dispatch<React.SetStateAction<Station | null>>,
    setLocation: React.Dispatch<React.SetStateAction<Location>>,
    setJourneysStarting: React.Dispatch<React.SetStateAction<number>>,
    setJourneysEnding: React.Dispatch<React.SetStateAction<number>>,
    setAvgStartingDistance: React.Dispatch<React.SetStateAction<number>>,
    setAvgEndingDistance: React.Dispatch<React.SetStateAction<number>>,
    setPopularReturnStations: React.Dispatch<React.SetStateAction<any[]>>,
    setPopularDepartureStations: React.Dispatch<React.SetStateAction<any[]>>,
  ) => {
    try {
      const requestUrl = `${serverUrl}/api/stations/${id}`;
      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const station:Station = data.station;
      const location:Location = {latitude:station.y, longitude:station.x} //y:lat; x:lng

      const fetchStationName = async (stationId: string) => {
        const response = await fetch(`${serverUrl}/api/stations/${stationId}`);
        const data = await response.json();
        return data.station.name;
      };
  
      const popularReturnStationsPromise = data.popularReturnStations.map(
        async (returnStation: { _id: string; count: number }) => {
          const name = await fetchStationName(returnStation._id);
          return { ...returnStation, name };
        }
      );
  
      const popularDepartureStationsPromise = data.popularDepartureStations.map(
        async (departureStation: { _id: string; count: number }) => {
          const name = await fetchStationName(departureStation._id);
          return { ...departureStation, name };
        }
      );
  
      const popularReturnStations = await Promise.all(popularReturnStationsPromise);
      const popularDepartureStations = await Promise.all(popularDepartureStationsPromise);
  
      setStation(station);
      setLocation(location);
      setJourneysStarting(data.journeysStarting);
      setJourneysEnding(data.journeysEnding);
      setAvgStartingDistance(data.averageStartingDistance);
      setAvgEndingDistance(data.averageEndingDistance);
      setPopularReturnStations(popularReturnStations);
      setPopularDepartureStations(popularDepartureStations);
      
    } catch (error) {
      console.error('Error fetching station data:', error);
    }
};


export const SingleStationView: React.FC<SingleStationViewProps> = (
    { stationId, onBack}) => {
  const [station, setStation] = useState<Station | null>(null);
  const [location, setLocation] = useState<Location>(defaultCenter);
  const [loading, setLoading] = useState(true);
  const [journeysStarting, setJourneysStarting] = useState(0);
  const [journeysEnding, setJourneysEnding] = useState(0);
  const [avgStartingDistance, setAvgStartingDistance] = useState(0);
  const [avgEndingDistance, setAvgEndingDistance] = useState(0);
  const [popularReturnStations, setPopularReturnStations] = useState<any>([]);
  const [popularDepartureStations, setPopularDepartureStations] = useState<any>([]);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const serverUrl = process.env.REACT_APP_SERVER_URL!;

  const toggleMapModal = () => {
    setIsMapModalOpen(!isMapModalOpen);
  };

  useEffect(() => {
    setLoading(true);
    (async () => {
      await fetchStation(
        serverUrl,
        stationId, 
        setStation, 
        setLocation, 
        setJourneysStarting, 
        setJourneysEnding, 
        setAvgStartingDistance, 
        setAvgEndingDistance,
        setPopularReturnStations,
        setPopularDepartureStations);
      setLoading(false);
    })();
  }, [stationId, serverUrl]);

  return (
    <div data-testid="single-station-view">
        {loading ? (
        <div className="spinner" >
          <CircularProgress />
        </div>
      ) : (
        station && (
            <div className='container__single-station'>
              <div className="container__station-details">
                <div className="header__station">
                  <Button className='button__back' 
                      onClick={onBack}> &larr; Back to Stations
                  </Button>
                  <h3 className='station-name'>{station.name}</h3>
                  <div className='station-address'>
                    <ListItemIcon>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <p className="station-detail-value" style={{ marginBottom: 0 }}>{station.address}</p>
                  </div>
                </div>
                <p className="show-map" onClick={toggleMapModal}>
                  Show Map
                </p>
                <div className="station-detail">
                  <h4 className="station-detail-title">Number of journeys started from this station</h4>
                  <p className="station-detail-value">{journeysStarting}</p>
                </div>
                <div className="station-detail">
                  <h4 className="station-detail-title">Number of journeys ended at this station</h4>
                  <p className="station-detail-value">{journeysEnding}</p>
                </div>
                <div className="station-detail">
                  <h4 className="station-detail-title">Average distance of a journey started from this station</h4>
                  <p className="station-detail-value">{(avgStartingDistance / 1000).toFixed(3)} km</p>
                </div>
                <div className="station-detail">
                  <h4 className="station-detail-title">Average distance of a journey ended at this station</h4>
                  <p className="station-detail-value">{(avgEndingDistance / 1000).toFixed(3)} km</p>
                </div>
                <div className="station-detail">
                  <h4 className="station-detail-title">Top 5 most popular return stations for journeys starting from this station</h4>
                  <ol>
                    {popularReturnStations.map((returnStation: any, index: number) => (
                      <li key={index}>{`${returnStation.name} (${returnStation.count} times)`}</li>
                    ))}
                  </ol>
                </div>
                <div className="station-detail">
                  <h4 className="station-detail-title">Top 5 most popular departure stations for journeys ending at this station</h4>
                  <ol>
                    {popularDepartureStations.map((departureStation: any, index: number) => (
                      <li key={index}>{`${departureStation.name} (${departureStation.count} times)`}</li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="container__map">
                <StationMap location={location} name={station.name} address={station.address} />
              </div>
              <MapModal isOpen={isMapModalOpen} onClose={toggleMapModal} station={station} location={location}/>
            </div>
          )
        )
        }
        
    </div>
  );
};