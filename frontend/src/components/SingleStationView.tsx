import React, { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

import '../styles/singleStationView.css';
import StationMap from './StationMap';
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
  ) => {
    const requestUrl = `${serverUrl}/api/stations/${id}`;
    const response = await fetch(requestUrl);
    const data = await response.json();
    const station:Station = data.station;
    const location:Location = {latitude:station.y, longitude:station.x} //y:lat; x:lng
    setStation(station);
    setLocation(location)
    setJourneysStarting(data.journeysStarting);
    setJourneysEnding(data.journeysEnding);
};


export const SingleStationView: React.FC<SingleStationViewProps> = (
    { stationId, onBack}) => {
  const [station, setStation] = useState<Station | null>(null);
  const [location, setLocation] = useState<Location>(defaultCenter);
  const [loading, setLoading] = useState(true);
  const [journeysStarting, setJourneysStarting] = useState(0);
  const [journeysEnding, setJourneysEnding] = useState(0);
  const serverUrl = process.env.REACT_APP_SERVER_URL!;

  useEffect(() => {
    setLoading(true);
    (async () => {
      await fetchStation(serverUrl, stationId, setStation, setLocation, setJourneysStarting, setJourneysEnding);
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
                {/* <h3 className='page-title'>Bicycle Station</h3> */}
                <div className="container__station-details">
                    <div className="header__station">
                        <Button className='button__back' 
                            onClick={onBack}> &larr; Back to Stations
                        </Button>
                    </div>
                    <h3 className='page-title'>Station Details</h3>
                    <h3>{station.name}</h3>
                    <dl>
                        <dt>Address:</dt>
                        <dd>{station.address}</dd>
                        <dt>Number of journeys started at this station:</dt>
                        <dd>{journeysStarting}</dd>
                        <dt>Number of journeys ended at this station:</dt>
                        <dd>{journeysEnding}</dd>
                    </dl>
                </div>
                <div className="vertical-separator"></div>
                <div className="container__map">
                    <StationMap location={location} />
                </div>
            </div>
        )
      )
    }
    </div>
  );
};