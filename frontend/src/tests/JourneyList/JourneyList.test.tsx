import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { JourneyList } from '../../components/JourneyList';

const serverUrl = 'http://fake-api.com/api';

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

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          journeys: mockJourneys,
          totalCount: 1,
          maxDuration: 300,
          maxDistance: 100,
        }),
      headers: new Headers(),
      ok: true,
      redirected: false,
      status: 200,
      statusText: "OK",
      type: "basic",
      url: "http://example.com",
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      text: () => Promise.resolve(""),
      clone: function () {
        return this;
      },
    })
  );
  await act(async () => {
    render(<JourneyList />);
  });
});

describe('JourneyList', () => {
  // clear all the mock functions after each test case
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders JourneyList component and its elements', async () => {

    await waitFor(() => expect(screen.getByText(/Refine results:/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByLabelText(/Search/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('distance-slider')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('duration-slider')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByText(/Station A/i)).toHaveLength(1));
  });

  it('handles search functionality', async () => {
    const searchInput = await waitFor(() => screen.getByLabelText(/Search/i));
    act(async () => {
      await waitFor(() => userEvent.type(searchInput, 'Station A'));
    });
    await waitFor(() => expect(searchInput).toHaveValue('Station A'));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });

});