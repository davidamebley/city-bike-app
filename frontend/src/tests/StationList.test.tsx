import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { StationList } from '../components/StationList';

// Mock fetch function to return sample data
const mockStations = [
    {
        _id: '1',
        name: 'Station 1',
        address: '123 Main St',
        x: 24.835356,
        y: 60.209017,
        journeysStarting: 5,
        journeysEnding: 12,
      },
      {
        _id: '2',
        name: 'Station 2',
        address: '456 Second St',
        x: 24.995356,
        y: 60.709017,
        journeysStarting: 5,
        journeysEnding: 12,
      },
];

beforeEach(async () => {

    global.fetch = jest.fn().mockImplementation(() => Promise.resolve(
        new Response(JSON.stringify({
            stations: mockStations,
            totalPages: 23,
            totalCount: 457,
        }))));
    
    await act(async () => {
      await waitFor(() => render(<StationList />));
    });
});

describe('StationList Component', () => {
    // clear all the mock functions after each test case
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('renders StationList component and its elements', async () => {
        await waitFor(() => expect(screen.getByLabelText(/Search/i)).toBeInTheDocument());
        await waitFor(() => expect (screen.getByText(/Add Station/i)).toBeInTheDocument());
        await waitFor(() => {
            const table = screen.getByRole('table');
            expect(table).toBeInTheDocument();
        });
        await waitFor(() => {
            const station1 = screen.getByText('Station 1');
            const station2 = screen.getByText('Station 2');
            expect(station1).toBeInTheDocument();
            expect(station2).toBeInTheDocument();
        });
    });

    it('handles search functionality', async () => {
        // Wait for the table to render
        await waitFor(() => screen.getByRole('table'));
        const searchInput = await waitFor(() => screen.getByLabelText(/Search/i));
      
        // Type into the search input
        await act(async () => {
          userEvent.type(searchInput, 'Station 1');
        });
      
        // Wait for the search input to have the correct value
        await waitFor(() => expect(searchInput).toHaveValue('Station 1'));
      
        // Add a delay to allow the debounce to complete and fetch to be called
        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
        });
      
        // Check the number of fetch calls
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    });

    it('handles pagination functionality', async () => {
        const pagination = screen.getByTestId('table-pagination');
    
        // Find the "next page" button and click it
        const nextPageButton = pagination.querySelector('[title="Go to next page"]');
        await waitFor(() => expect(nextPageButton).toBeInTheDocument())
        await waitFor(() => expect(nextPageButton).toBeEnabled());

        await act(async () => {
            nextPageButton && fireEvent.click(nextPageButton);
        });

        await waitFor(() => expect(fetch).toBeCalledTimes(2));
      });

    it('adds a new station', async () => {      
        const addStationButton = screen.getByText('Add Station');
        fireEvent.click(addStationButton);
      
        const saveButton = screen.getByText('Save');
        expect(saveButton).toBeInTheDocument();
    });

    it('clicks a station from the list to display SingleStationView', async () => {
        // Ensure that SingleStationView is not rendered before clicking 
        const singleStationView = screen.queryByTestId('single-station-view');
        expect(singleStationView).not.toBeInTheDocument();
      
        const stationRow = screen.getByText('Station 1').closest('tr');
        if (stationRow) {
            await act(async () => {
                fireEvent.click(stationRow);
            });
        }
      
        // Check if SingleStationView is rendered after clicking on the table row
        await waitFor(() => expect(screen.getByTestId('single-station-view')).toBeInTheDocument());
    });
});