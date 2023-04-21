import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { SingleStationView } from '../components/SingleStationView'; 

jest.mock('./StationMap', () => () => <div data-testid="station-map" />);
jest.mock('./MapModal', () => () => <div data-testid="map-modal" />);

jest.mock('../__mocks__/fetchStation');

test('renders SingleStationView and its components', async () => {
  const stationId = '1';
  const onBack = jest.fn();
  const { findByTestId } = render(
    <SingleStationView stationId={stationId} onBack={onBack} />
  );

  // Check if the station name is rendered
  expect(await screen.findByText('Station 1')).toBeInTheDocument();

  // Check if the StationMap component is rendered
  expect(await findByTestId('station-map')).toBeInTheDocument();

  // Check if the MapModal component is rendered
  expect(await findByTestId('map-modal')).toBeInTheDocument();
});
