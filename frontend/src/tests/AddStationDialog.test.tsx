import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddStationDialog } from '../components/AddStationDialog';

describe('AddStationDialog Component', () => {
  const handleClose = jest.fn();
  const handleSave = jest.fn();

  beforeEach(() => {
    render(<AddStationDialog open={true} onClose={handleClose} onSave={handleSave} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders AddStationDialog component and its elements', () => {
    expect(screen.getByText('Add New Station')).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Latitude Coordinate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Longitude Coordinate/i)).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('closes the dialog when the Cancel button is clicked', () => {
    fireEvent.click(screen.getByText('Cancel'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('disables the Save button when required fields are empty', () => {
    expect(screen.getByText('Save')).toBeDisabled();
  });

  it('enables the Save button when all fields are filled out', () => {
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Station 1' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/Latitude Coordinate/i), { target: { value: '24.835356' } });
    fireEvent.change(screen.getByLabelText(/Longitude Coordinate/i), { target: { value: '60.209017' } });
    expect(screen.getByText('Save')).toBeEnabled();
  });

  it('calls onSave with correct values when Save button is clicked', () => {
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Station 1' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/Latitude Coordinate/i), { target: { value: '24.835356' } });
    fireEvent.change(screen.getByLabelText(/Longitude Coordinate/i), { target: { value: '60.209017' } });
    fireEvent.click(screen.getByText('Save'));
    expect(handleSave).toHaveBeenCalledWith('Station 1', '123 Main St', 24.835356, 60.209017);
  });
});
