import StationMap from './StationMap';
import '../styles/mapModal.css'

interface Location {
    latitude: number;
    longitude: number;
  }
  
  interface Station {
    name: string;
    address: string;
  }

  interface MapModalProps{
    isOpen: boolean; 
    onClose: () => void;
    station: Station|null;
    location: Location
  }

export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, station, location }) => {
    if (!isOpen || !station) return null

    return (
      <div className={`map-modal ${isOpen ? "map-modal__open" : ""}`}>
        <div className="map-modal__content">
          <button type={'button'} className="map-modal__close" onClick={onClose}>
            &times;
          </button>
          {station && <StationMap location={location} name={station.name} address={station.address} />}
        </div>
      </div>
    );
  };
  