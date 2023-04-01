import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

interface Location {
  latitude: number;
  longitude: number;
}

interface StationMapProps {
  location: Location;
}

const StationMap: React.FC<StationMapProps> = ({ location }) => {
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
        key={location.latitude}
        center={[location.latitude, location.longitude]}
        pathOptions={{ color: 'blue', fillColor: 'blue' }}
        radius={10}
      >
        <Popup>Location: {location.latitude}, {location.longitude}</Popup>
      </CircleMarker>
    </MapContainer>
  );
};

export default StationMap;
