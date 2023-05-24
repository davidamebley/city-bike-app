import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, useMediaQuery, useTheme, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { JourneyList } from './components/JourneyList';
import { StationList } from './components/StationList';
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 'sm' = 600px.

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (isMobile) setOpen(false); // Close the Drawer when a Tab is selected on mobile
  };

  const handleMenu = () => {
    setOpen(!open);
  };

  return (
    <div className="App" data-testid="main-page">
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
          {
            isMobile ? (
              <>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenu}>
                  <MenuIcon />
                </IconButton>
                <Drawer anchor="right" open={open} onClose={handleMenu}>
                  <List>
                    <ListItem disablePadding>
                      <ListItemButton onClick={(event) => handleChange(event, 0)}>
                        Journeys
                      </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                      <ListItemButton onClick={(event) => handleChange(event, 1)}>
                        Stations
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Drawer>
              </>
            ):(
              <Tabs value={activeTab} onChange={handleChange} textColor="primary">
                <Tab data-testid="journeys-list-button" label="Journeys" />
                <Tab data-testid="stations-list-button" label="Stations" />
              </Tabs>
            )
          }
        </Toolbar>
      </AppBar>
      {activeTab === 0 && <JourneyList />}
      {activeTab === 1 && <StationList />}
    </div>
  );
}

export default App;