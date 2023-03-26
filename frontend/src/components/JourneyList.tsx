import React, { useEffect, useState } from 'react';

interface Journey {
  departure: string;
  return: string;
  departure_station_name: string;
  return_station_name: string;
  covered_distance: number;
  duration: number;
}

export const JourneyList: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);

  useEffect(() => {
    fetch('/api/journeys')
      .then((res) => res.json())
      .then((data) => setJourneys(data));
  }, []);

  return (
    <div>
      <h2>Journey List</h2>
      <ul>
        {journeys.map((journey, index) => (
          <li key={index}>
            {journey.departure_station_name} - {journey.return_station_name}, {journey.covered_distance / 1000} km, {journey.duration / 60} min
          </li>
        ))}
      </ul>
    </div>
  );
};