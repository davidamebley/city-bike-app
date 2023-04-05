import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

import '../styles/stationMap.css';

interface Location {
  latitude: number;
  longitude: number;
}

interface StationMapProps {
  location: Location;
  name: string;
  address: string;
}

const StationMap: React.FC<StationMapProps> = ({ location, name, address }) => {
  const defaultCenter = {
    lat: 60.1699,
    lng: 24.9384,
  };
  const defaultZoom = 13;

  return (
    <MapContainer center={{lat:location.latitude, lng:location.longitude}} zoom={defaultZoom} style={{ height: '100%', width: '100%' }} className="station-map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        className='circle-marker'
        key={location.latitude}
        center={[location.latitude, location.longitude]}
        radius={10}
        weight={5}
      >
        <Popup>
          <b>{name}</b>
          <br/>
          {address}
        </Popup>
      </CircleMarker>
    </MapContainer>
  );
};

export default StationMap;
