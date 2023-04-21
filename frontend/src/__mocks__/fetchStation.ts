// Mock data for a single station
const mockStationData = {
    station: {
      _id: '1',
      name: 'Station 1',
      address: 'Address 1',
      x: 12.34,
      y: 56.78,
      journeysStarting: 10,
      journeysEnding: 8,
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
  
  // Mock fetchStation function
  export const fetchStation = jest.fn(async () => {
    return Promise.resolve(mockStationData);
  });
  