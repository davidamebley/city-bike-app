import React, { useEffect, useState } from 'react';

interface StationInfo {
  station: {
    name: string;
    address: string;
  };
  journeysStarting: number;
  journeysEnding: number;
}

interface SingleStationViewProps {
  stationId: string;
}

export const SingleStationView: React.FC<SingleStationViewProps> = ({ stationId }) => {
  const [stationInfo, setStationInfo] = useState<StationInfo | null>(null);

  useEffect(() => {
    fetch(`/api/stations/${stationId}`)
      .then((res) => res.json())
      .then((data) => setStationInfo(data));
  }, [stationId]);

  return (
    stationInfo && (
      <div>
        <h3>{stationInfo.station.name}</h3>
        <p>Address: {stationInfo.station.address}</p>
        <p>Journeys starting: {stationInfo.journeysStarting}</p>
        <p>Journeys ending: {stationInfo.journeysEnding}</p>
      </div>
    )
  );
};