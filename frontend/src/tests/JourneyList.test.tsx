import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { JourneyList } from '../components/JourneyList';

// Mock fetch function to return sample data
const mockJourneys = [
  {
    departure: '2023-01-01T00:00:00Z',
    return: '2023-01-01T00:00:00Z',
    departure_station_name: 'Station A',
    return_station_name: 'Station B',
    covered_distance: 100,
    duration: 600,
  },
  {
    departure: '2023-01-01T00:00:00Z',
    return: '2023-01-01T00:00:00Z',
    departure_station_name: 'Station C',
    return_station_name: 'Station D',
    covered_distance: 150,
    duration: 900,
  },
];


beforeEach(async () => {

  global.fetch = jest.fn().mockImplementation(() => Promise.resolve(
    new Response(JSON.stringify({
    journeys: mockJourneys,
    totalCount: 1,
    maxDuration: 300,
    maxDistance: 100,
  }))));
 
  await act(async () => {
    await waitFor(() => render(<JourneyList />));
  });
});

describe('JourneyList Component', () => {
  // clear all the mock functions after each test case
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders JourneyList component and its elements', async () => {

    await waitFor(() => expect(screen.getByText(/Refine results:/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByLabelText(/Search/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('min-distance-input')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('max-distance-input')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('min-duration-input')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('max-duration-input')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByText(/Station A/i)).toHaveLength(1));
  });

  it('handles search functionality', async () => {
    // Wait for the table to render
    await waitFor(() => screen.getByRole('table'));
    const searchInput = await waitFor(() => screen.getByLabelText(/Search/i));
  
    // Type into the search input
    await act(async () => {
      userEvent.type(searchInput, 'Station A');
    });
  
    // Wait for the search input to have the correct value
    await waitFor(() => expect(searchInput).toHaveValue('Station A'));
  
    // Add a delay to allow the debounce to complete and fetch to be called
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });
  
    // Check the number of fetch calls
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });
  
  it('handles sorting functionality', async () => {
    const departureSortLabel = screen.getByText(/Departure Station/i);
    await act(async () => {
      fireEvent.click(departureSortLabel);
    });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });

  it('handles pagination functionality', async () => {
    const pagination = screen.getByTestId('table-pagination');

    // Find the "next page" button and click it
    const nextPageButton = pagination.querySelector('[title="Go to next page"]');
    await waitFor(() => expect(nextPageButton).toBeInTheDocument())
    await waitFor(() => expect(nextPageButton).toBeDisabled());
  });

  it('handles filter functionality', async () => {
    const minDistanceInput = await screen.findByTestId('min-distance-input');
    const maxDistanceInput = await screen.findByTestId('max-distance-input');
    const minDurationInput = await screen.findByTestId('min-duration-input');
    const maxDurationInput = await screen.findByTestId('max-duration-input');

    const minDistanceNativeInput = minDistanceInput.querySelector('input');
    const maxDistanceNativeInput = maxDistanceInput.querySelector('input');
    const minDurationNativeInput = minDurationInput.querySelector('input');
    const maxDurationNativeInput = maxDurationInput.querySelector('input');
  
    // Type values into the input fields
    await act(async () => {
      minDistanceNativeInput &&
      fireEvent.change(minDistanceNativeInput, { target: { value: '50' } });
      maxDistanceNativeInput && 
      fireEvent.change(maxDistanceNativeInput, { target: { value: '150' } });
      minDurationNativeInput &&
      fireEvent.change(minDurationNativeInput, { target: { value: '300' } });
      maxDurationNativeInput &&
      fireEvent.change(maxDurationNativeInput, { target: { value: '600' } });
    });
  
    // Wait for the input fields to have the correct values
    await waitFor(() => expect(minDistanceNativeInput).toHaveValue(50));
    await waitFor(() => expect(maxDistanceNativeInput).toHaveValue(150));
    await waitFor(() => expect(minDurationNativeInput).toHaveValue(300));
    await waitFor(() => expect(maxDurationNativeInput).toHaveValue(600));

  
    // Add a delay to allow the debounce to complete and fetch to be called
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });
  
    // Check the number of fetch calls
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });
    

});