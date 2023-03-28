import React, { useEffect, useState } from 'react';

import { SingleStationView } from './SingleStationView';

interface Station {
  id: string;
  name: string;
}

export const StationList: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
//   console.log(`Server url: ${serverUrl}`)

  useEffect(() => {
    fetch(`${serverUrl}/api/stations`)
    .then((res) => res.json())
    .then((data) => setStations(data.stations));
  }, []);

  return (
    <div>
      <h2>Station List</h2>
      <ul>
        {stations.map((station, index) => (
          <li key={index}>
            <SingleStationView stationId={station.id} />
          </li>
        ))}
      </ul>
    </div>
  );
};