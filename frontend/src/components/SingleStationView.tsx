import React, { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

interface Station {
    _id: string
    name: string;
    address: string;
    x: number;
    y: number;
    journeysStarting: number;
    journeysEnding: number;
}

interface SingleStationViewProps {
  stationId: string;
  onBack: ()=>void;
}

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

export const SingleStationView: React.FC<SingleStationViewProps> = (
    { stationId, onBack}) => {
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [journeysStarting, setJourneysStarting] = useState(0);
  const [journeysEnding, setJourneysEnding] = useState(0);
  const serverUrl = process.env.REACT_APP_SERVER_URL!;

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
            <div>
                <Button onClick={onBack}>Back to Stations List</Button>
                <h2>Bicycle Station</h2>
                <h3>{station.name}</h3>
                <p>Address: {station.address}</p>
                <p>Number of journeys started at this station: {journeysStarting}</p>
                <p>Number of journeys ended at this station: {journeysEnding}</p>
            </div>
        )
      )
    }
    </div>
  );
};