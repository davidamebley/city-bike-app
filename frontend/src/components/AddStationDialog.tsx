import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface AddStationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, address: string, x: number, y: number) => void;
}

export const AddStationDialog: React.FC<AddStationDialogProps> = ({ open, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSave = () => {
    onSave(name, address, parseFloat(latitude), parseFloat(longitude));
    setName('');
    setAddress('');
    setLatitude('');
    setLongitude('');
  };

  return (
    <Dialog 
      data-testid="add-station-dialog" open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Station</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid="station-name-input"
        />
        <TextField
          margin="dense"
          label="Address"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          data-testid="station-address-input"
        />
        <TextField
          margin="dense"
          label="Latitude Coordinate"
          fullWidth
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          data-testid="station-latitude-input"
        />
        <TextField
          margin="dense"
          label="Longitude Coordinate"
          fullWidth
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          data-testid="station-longitude-input"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!name || !address || !latitude || !longitude}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};