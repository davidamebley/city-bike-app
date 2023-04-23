describe('Bike Station App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Loads the main page', () => {
    cy.get('[data-testid="main-page"]').should('be.visible');
  });

  it('Opens the station list and checks for stations', () => {
    cy.get('[data-testid="stations-list-button"]').click();
    cy.get('[data-testid="stations-list"]').should('be.visible');
    cy.get('[data-testid="station-item"]').should('have.length.gt', 0);
  });

  it('Opens a single station view and checks for details', () => {
    cy.get('[data-testid="stations-list-button"]').click();
    cy.get('[data-testid="station-item"]').first().click();
    cy.get('[data-testid="single-station-view"]').should('be.visible');
    cy.get('.station-name').should('not.be.empty');
  });

  it('Navigates back to the station list from single station view', () => {
    cy.get('[data-testid="stations-list-button"]').click();
    cy.get('[data-testid="station-item"]').first().click();
    cy.get('.button__back').click();
    cy.get('[data-testid="stations-list"]').should('be.visible');
  });

  it('Adds a new station', () => {
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
    cy.get('[data-testid="stations-list-button"]').click();
    cy.get('[data-testid="stations-list"]').should('be.visible');
  
    cy.get('[data-testid="search-input"]').type('Test Station');
    cy.get('[data-testid="station-item"]').should('contain', 'Test Station');
  });
  
  it('Searches for a journey in the journey list', () => {
    cy.get('[data-testid="journeys-list-button"]').click();
    cy.get('[data-testid="journeys-list"]').should('be.visible');
  
    cy.get('[data-testid="search-input"]').type('Katariina');
    cy.get('[data-testid="journey-item"]').should('contain', 'Katariina');
  });

  it('Paginates through the station list', () => {
    cy.get('[data-testid="stations-list-button"]').click();
    cy.get('[data-testid="stations-list"]', { timeout: 10000 }).should('be.visible');
  
    cy.get('button[aria-label="Go to next page"]').click();
    cy.get('[data-testid="station-item"]').should('have.length.gt', 0);
  
    cy.get('button[aria-label="Go to previous page"]').click();
    cy.get('[data-testid="station-item"]').should('have.length.gt', 0);
  });
  
  it('Paginates through the journey list', () => {
    cy.get('[data-testid="journeys-list-button"]').click();
    cy.get('[data-testid="journeys-list"]', { timeout: 10000 }).should('be.visible');
  
    cy.get('button[aria-label="Go to next page"]').click();
    cy.get('[data-testid="journey-item"]').should('have.length.gt', 0);
  
    cy.get('button[aria-label="Go to previous page"]').click();
    cy.get('[data-testid="journey-item"]').should('have.length.gt', 0);
  });
  
  
});
