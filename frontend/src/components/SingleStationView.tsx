import React, { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

import '../styles/singleStationView.css';
import StationMap from './StationMap';

interface Station {
    _id: string
    name: string;
    address: string;
    x: number;
    y: number;
    journeysStarting: number;
    journeysEnding: number;
}

interface StationL {
    _id: string
    name: string;
    address: string;
    x: number;
    y: number;
}

interface Location {
    latitude: number;
    longitude: number;
    
}

interface SingleStationViewProps {
  stationId: string;
  onBack: ()=>void;
}

const defaultCenter = {
    latitude: 60.1699,
    longitude: 24.9384,
  };

const fetchStation = async (
    serverUrl: string,
    id: string,
    setStation: React.Dispatch<React.SetStateAction<Station | null>>,
    setJourneysStarting: React.Dispatch<React.SetStateAction<number>>,
    setJourneysEnding: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    const requestUrl = `${serverUrl}/api/stations/${id}`;
    const response = await fetch(requestUrl);
    const data = await response.json();
    setStation(data.station);
    setJourneysStarting(data.journeysStarting);
    setJourneysEnding(data.journeysEnding);
};

const fetchLocations = async (
    serverUrl: string,
    setLocations: React.Dispatch<React.SetStateAction<Location[]>>,
  ) => {
    const requestUrl = `${serverUrl}/api/stations`;
    const response = await fetch(requestUrl);
    const data = await response.json();
    const stations:StationL[] = data.stations;
    const locations: Location[] = stations.map((station) => ({
        latitude: station.x,
        longitude: station.y,
      }));
    setLocations(locations);
    console.log(`Locations: ${JSON.stringify(locations)}`)    
};

export const SingleStationView: React.FC<SingleStationViewProps> = (
    { stationId, onBack}) => {
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [journeysStarting, setJourneysStarting] = useState(0);
  const [journeysEnding, setJourneysEnding] = useState(0);
  const [locations, setLocations] = useState<Location[]>([]);
  const serverUrl = process.env.REACT_APP_SERVER_URL!;

  useEffect(() => {
    (async () => {
        fetchLocations(serverUrl, setLocations);
    })();
  }, []);
  

  useEffect(() => {
    setLoading(true);
    (async () => {
      await fetchStation(serverUrl, stationId, setStation, setJourneysStarting, setJourneysEnding);
      setLoading(false);
    })();
  }, [stationId]);

  return (
    <div>
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
                            onClick={onBack}>Back to Stations List
                        </Button>
                        <h2>Bicycle Station</h2>
                    </div>
                    <h3>{station.name}</h3>
                    <p>Address: {station.address}</p>
                    <p>Number of journeys started at this station: {journeysStarting}</p>
                    <p>Number of journeys ended at this station: {journeysEnding}</p>
                </div>
                <div className="vertical-separator"></div>
                <div className="container__map">
                    <StationMap location={defaultCenter} />
                </div>
            </div>
        )
      )
    }
    </div>
  );
};