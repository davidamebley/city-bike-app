describe('Bike Station App', () => {
  beforeEach(() => {
    // cy.intercept('GET', '**/api/stations?*', {
    //   fixture: 'stations.json',
    // }).as('getStations');
    
    cy.visit('http://localhost:3000');
  });

  it('Loads the main page', () => {
    cy.get('[data-testid="main-page"]').should('be.visible');
  });

  it('Opens the station list and checks for stations', () => {
    // Mock the API response for the /api/stations endpoint
    cy.intercept('GET', '**/api/stations?*', {
      fixture: 'stations.json',
    }).as('getStations');
  
    // Click the button that renders the StationList component
    cy.get('[data-testid="stations-list-button"]').click();
  
    // Wait for the mocked API call to complete
    cy.wait('@getStations');
  
    // Assertions
    cy.get('[data-testid="stations-list"]').should('be.visible');
    cy.get('[data-testid="station-item"]').should('have.length.gt', 0);
  });  

  it('Opens a single station view and checks for details', () => {
    // Mock the API response for the /api/stations endpoint
    cy.intercept('GET', '**/api/stations?*', {
      fixture: 'stations.json',
    }).as('getStations');
  
    // Mock the API response for the /api/stations/:id endpoint
    cy.intercept('GET', '**/api/stations/*', {
      fixture: 'station.json',
    }).as('getStation');
  
    cy.get('[data-testid="stations-list-button"]').click();
    // Wait for the mocked API call to complete
    cy.wait('@getStations');
  
    cy.get('[data-testid="station-item"]').first().click();
  
    // Wait for the mocked API call to complete
    cy.wait('@getStation');
  
    cy.get('[data-testid="single-station-view"]').should('be.visible');
    cy.get('.station-name').should('not.be.empty');
  });  

  it('Navigates back to the station list from single station view', () => {
    // Mock the API response for the /api/stations endpoint
    cy.intercept('GET', '**/api/stations?*', {
      fixture: 'stations.json',
    }).as('getStations');

    // Mock the API response for the /api/stations/:id endpoint
    cy.intercept('GET', '**/api/stations/*', {
      fixture: 'station.json',
    }).as('getStation');

    cy.get('[data-testid="stations-list-button"]').click();
    // Wait for the mocked API call to complete
    cy.wait('@getStations');

    cy.get('[data-testid="station-item"]').first().click();

    // Wait for the mocked API call to complete
    cy.wait('@getStation');

    // Wait for the data to be loaded
    cy.get('[data-testid="single-station-view"]').should('be.visible');

    // Find the back button within the single-station-view scope
    cy.get('[data-testid="single-station-view"]').find('[data-testid="back-button"]').click();

    // Wait for the stations list to be visible
    cy.get('[data-testid="stations-list"]').should('be.visible'); // 10 seconds
  });

  it('Adds a new station', () => {
    // Mock the API response for the /api/stations POST request (adding a station)
    cy.intercept('POST', '**/api/stations*', {
      statusCode: 200,
      body: {},
    });

    cy.get('[data-testid="stations-list-button"]').click();
    cy.get('[data-testid="add-station-button"]').click();
    cy.get('[data-testid="add-station-dialog"]').should('be.visible');

    cy.get('[data-testid="station-name-input"]').type('Test Station');
    cy.get('[data-testid="station-address-input"]').type('Test Address 123');
    cy.get('[data-testid="station-latitude-input"]').type('60.1234');
    cy.get('[data-testid="station-longitude-input"]').type('24.5678');

    cy.get('button:contains("Save")').click();
    cy.get('[data-testid="add-station-dialog"]').should('not.exist');

    cy.get('[data-testid="stations-list-button"]').click();
    cy.get('[data-testid="stations-list"]').should('be.visible');
    cy.get('[data-testid="station-item"]').contains('Test Station').should('exist');
  });

  it('Searches for a station in the station list', () => {
    // Mock the API response for the /api/stations endpoint
    cy.intercept('GET', '**/api/stations?*', {
      fixture: 'stations.json',
    }).as('getStations');

    cy.get('[data-testid="stations-list-button"]').click();
    // Wait for the mocked API call to complete
    cy.wait('@getStations');

    cy.get('[data-testid="stations-list"]').should('be.visible');

    cy.get('[data-testid="search-input"]').type('Station A');
    cy.get('[data-testid="station-item"]').should('contain', 'Station A');
  });

  it('Searches for a journey in the journey list', () => {
    // Mock the API response for the /api/journeys endpoint
    cy.intercept('GET', '**/api/journeys?*', {
      fixture: 'journeys.json',
    }).as('getJourneys');

    cy.get('[data-testid="journeys-list-button"]').click();
    // Wait for the mocked API call to complete
    cy.wait('@getJourneys');

    cy.get('[data-testid="journeys-list"]').should('be.visible');

    cy.get('[data-testid="search-input"]').type('Station');
    cy.get('[data-testid="journey-item"]').should('contain', 'Station');
  });

  it('Paginates through the station list', () => {
    // Mock the API response for the /api/stations endpoint
    cy.intercept('GET', '**/api/stations?*', {
      fixture: 'stations.json',
    }).as('getStations');

    cy.get('[data-testid="stations-list-button"]').click();
    // Wait for the mocked API call to complete
    cy.wait('@getStations');

    cy.get('[data-testid="stations-list"]').should('be.visible');

    cy.get('button[aria-label="Go to next page"]').click();
    // Wait for the mocked API call to complete
    cy.wait('@getStations');

    cy.get('[data-testid="station-item"]').should('have.length.gt', 0);

    cy.get('button[aria-label="Go to previous page"]').click();
    // Wait for the mocked API call to complete
    cy.wait('@getStations');

    cy.get('[data-testid="station-item"]').should('have.length.gt', 0);
  });

  it('Paginates through the journey list', () => {
    // Mock the API response for the /api/journeys endpoint
    cy.intercept('GET', '**/api/journeys?*', {
      fixture: 'journeys.json',
    }).as('getJourneys');

    cy.get('[data-testid="journeys-list-button"]').click();
    // Wait for the mocked API call to complete
    cy.wait('@getJourneys');

    cy.get('[data-testid="journeys-list"]').should('be.visible');

    cy.get('button[aria-label="Go to next page"]').click();
    // Wait for the mocked API call to complete
    cy.wait('@getJourneys');

    cy.get('[data-testid="journey-item"]').should('have.length.gt', 0);

    cy.get('button[aria-label="Go to previous page"]').click();
    // Wait for the mocked API call to complete
    cy.wait('@getJourneys');

    cy.get('[data-testid="journey-item"]').should('have.length.gt', 0);
  });

  it('Filters journeys by distance', () => {
    // Mock the API response for the /api/journeys endpoint
    cy.intercept('GET', '**/api/journeys?*', {
      fixture: 'journeys.json',
    }).as('getJourneys');

    cy.get('[data-testid="journeys-list-button"]').click();
    // Wait for the mocked API call to complete
    cy.wait('@getJourneys');

    cy.get('[data-testid="journeys-list"]').should('be.visible');

    const maxDistance = 10;
    cy.get('[data-testid="max-distance-input"]').type(maxDistance);

    cy.get('[data-testid="journey-item"]').each(($journeyItem) => {
      cy.wrap($journeyItem).invoke('text').then((text) => {
        const distanceText = text.match(/(\d+(\.\d+)?)\s?km/);
        const distance = distanceText && parseFloat(distanceText[1]);
        expect(distance).to.be.at.most(maxDistance);
      });
    });
  });

  it('Filters journeys by duration', () => {
    // Mock the API response for the /api/journeys endpoint
    cy.intercept('GET', '**/api/journeys?*', {
      fixture: 'journeys.json',
    }).as('getJourneys');

    cy.get('[data-testid="journeys-list-button"]').click();
    // Wait for the mocked API call to complete
    cy.wait('@getJourneys');

    cy.get('[data-testid="journeys-list"]').should('be.visible');

    const maxDuration = 10;
    cy.get('[data-testid="max-duration-input"]').type(maxDuration);

    cy.get('[data-testid="journey-item"]').each(($journeyItem) => {
      cy.wrap($journeyItem).invoke('text').then((text) => {
        const durationText = text.match(/(\d+(\.\d+)?)\s?km/);
        const duration = durationText && parseFloat(durationText[1]);
        expect(duration).to.be.at.most(maxDuration);
      });
    });
  });

});