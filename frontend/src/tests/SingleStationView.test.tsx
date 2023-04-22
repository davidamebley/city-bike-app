import { act, render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { SingleStationView } from '../components/SingleStationView';
import { MockStationMap, MockMapModal } from '../__mocks__/mockComponents';

const mockStationData = {
  station: {
    _id: '1',
    name: 'Station 1',
    address: 'Address 1',
    x: 12.34,
    y: 56.78,
  },
  journeysStarting: 10,
  journeysEnding: 8,
  averageStartingDistance: 5000,
  averageEndingDistance: 4500,
  popularReturnStations: [
    { _id: '2', name: 'Station 2', count: 4 },
    { _id: '3', name: 'Station 3', count: 3 },
  ],
  popularDepartureStations: [
    { _id: '4', name: 'Station 4', count: 5 },
    { _id: '5', name: 'Station 5', count: 2 },
  ],
};

const stationId = '1';

beforeEach(async () => {
  jest.mock('../components/StationMap.tsx', () => MockStationMap);
  jest.mock('../components/MapModal.tsx', () => MockMapModal);

  global.fetch = jest.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify(mockStationData))));
  
  await act(async () => {
    const onBack = jest.fn();
    render(<SingleStationView stationId={stationId} onBack={onBack} />);
  });
});

describe('SingleStationView Component', () => {
  // clear all the mock functions after each test case
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a single station', async () => {
    // Check if SingleStationView is rendered
    await waitFor(() => expect(screen.getByTestId('single-station-view')).toBeInTheDocument());

    // Check if the station name is rendered
    await waitFor(() => expect(screen.getByText('Station 1')).toBeInTheDocument());
  });

  it('renders StationMap component', async () => {
    // Check if the StationMap component is rendered
    await waitFor(() => expect(screen.getByTestId('single-station-view').querySelector('.container__map')).toBeInTheDocument());
  });

  it('renders MapModal when clicking on Show Map', async () => {
    // Check if Show Map element is rendered
    const showMap = await waitFor(() => (screen.getByText('Show Map')));
    await waitFor(() => expect(showMap).toBeInTheDocument());
    // Click on the Show Map element
    await waitFor(() => fireEvent.click(showMap));

    // Check if the MapModal is rendered
    await waitFor(() => expect(screen.getByTestId('single-station-view').querySelector('.map-modal__open')).toBeInTheDocument())
  });

});
