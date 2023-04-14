import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { JourneyList } from '../../components/JourneyList';

// Mock fetch function to return sample data
const mockJourneys = [
  {
    departure: "2023-03-18T10:00:00",
    return: "2023-03-18T12:00:00",
    departure_station_name: "Station A",
    return_station_name: "Station B",
    covered_distance: 10000,
    duration: 7200,
  },
];

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
    url: "https://example.com",
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

describe('JourneyList', () => {
  
});