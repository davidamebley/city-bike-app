import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Toolbar, Typography } from '@mui/material';

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
      <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Helsinki city bike app
          </Typography>
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