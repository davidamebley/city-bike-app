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
    setAvgStartingDistance: React.Dispatch<React.SetStateAction<number>>,
    setAvgEndingDistance: React.Dispatch<React.SetStateAction<number>>,
    setPopularReturnStations: React.Dispatch<React.SetStateAction<any[]>>,
    setPopularDepartureStations: React.Dispatch<React.SetStateAction<any[]>>,
  ) => {
    const requestUrl = `${serverUrl}/api/stations/${id}`;
    const response = await fetch(requestUrl);
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
  const serverUrl = process.env.REACT_APP_SERVER_URL!;

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
                        <dt>Average distance of a journey started from this station:</dt>
                        <dd>{(avgStartingDistance/1000).toFixed(3)} km</dd>
                        <dt>Average distance of a journey ended at this station:</dt>
                        <dd>{(avgEndingDistance/1000).toFixed(3)} km</dd>
                        <dt>Top 5 most popular return stations for journeys starting at this station:</dt>
                        {
                          popularReturnStations.map((returnStation:any, index:number) =>(
                            <React.Fragment key={index}>
                              <dd>{`${returnStation.name} (${returnStation.count} times)`}</dd>
                            </React.Fragment>
                          ))
                        }
                        <dt>Top 5 most popular departure stations for journeys ending at this station:</dt>
                        {
                          popularDepartureStations.map((departureStation:any, index:number) =>(
                            <React.Fragment key={index}>
                              <dd>{`${departureStation.name} (${departureStation.count} times)`}</dd>
                            </React.Fragment>
                          ))
                        }
                    </dl>
                </div>
                <div className="vertical-separator"></div>
                <div className="container__map">
                    <StationMap location={location} name={station.name} address={station.address} />
                </div>
            </div>
        )
      )
    }
    </div>
  );
};