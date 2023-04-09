import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Toolbar, Typography, Box } from '@mui/material';

import { JourneyList } from './components/JourneyList';
import { StationList } from './components/StationList';
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div className="App">
      <AppBar position="static" color="default" sx={{ backgroundColor: 'white' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ textAlign: 'start', cursor:'pointer', flexGrow: 1, color:'#1976d2'}}
              onClick={() => setActiveTab(0)}
            >
              Helsinki City Bikes
            </Typography>
          </Box>
          <Tabs value={activeTab} onChange={handleChange} textColor="primary">
            <Tab label="Journeys" />
            <Tab label="Stations" />
          </Tabs>
        </Toolbar>
      </AppBar>
      {activeTab === 0 && <JourneyList />}
      {activeTab === 1 && <StationList />}
    </div>
  );
}

export default App;