// Mock data for the station list
const mockStationListData = [
    {
      _id: '1',
      name: 'Station 1',
      address: 'Address 1',
      x: 12.34,
      y: 56.78,
      journeysStarting: 10,
      journeysEnding: 8,
    },
    {
      _id: '2',
      name: 'Station 2',
      address: 'Address 2',
      x: 23.45,
      y: 67.89,
      journeysStarting: 15,
      journeysEnding: 12,
    },
  ];
  
  // Mock API function
  export const fetchStations = jest.fn(async () => {
    return Promise.resolve(mockStationListData);
});
  