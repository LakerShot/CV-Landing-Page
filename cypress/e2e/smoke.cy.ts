import { SECTION_IDS } from '../support/e2e';

describe('landing page', () => {
  beforeEach(() => {
    cy.visit('/en');
  });

  it('renders the name as the single top-level heading', () => {
    /*
     * The name is split across two block spans so it cannot break mid-word, and
     * uppercasing is done with text-transform. Asserting the exact text node
     * guards both: a missing space would leave "EgorMorozov" as the accessible
     * name, which is what crawlers and screen readers consume.
     */
    cy.get('h1').should('have.length', 1).and('contain.text', 'Egor Morozov');
  });

  it('renders every section anchor', () => {
    SECTION_IDS.forEach((id) => {
      cy.get(`section#${id}`).should('exist');
    });
  });

  it('shows the role and the summary', () => {
    cy.contains('Frontend Developer').should('be.visible');
    cy.contains('7 years of experience').should('be.visible');
  });

  it('lists all four employers and the mentoring entry', () => {
    ['Salmon', 'Reelmotion Games', 'Crimtan', 'Java Mentor'].forEach((company) => {
      cy.contains('section#experience', company).should('exist');
    });
    cy.contains('section#mentoring', 'Kata Academy').should('exist');
  });

  it('renders skill meters with resolved values', () => {
    cy.get('[role="meter"]').should('have.length', 8);
    cy.get('[role="meter"]').each(($meter) => {
      const value = Number($meter.attr('aria-valuenow'));
      expect(value).to.be.within(0, 100);
    });
  });

  it('reveals content rather than leaving it stuck at opacity 0', () => {
    // Guards the `.js` pre-hide: if GSAP failed to run, the page would be blank.
    cy.get('section#skills').scrollIntoView();
    cy.contains('Storybook').should('be.visible');
  });

  it('navigates to a section from the header', () => {
    cy.viewport(1440, 900);
    cy.contains('nav button', 'Experience').click();
    cy.location('pathname').should('eq', '/en');
    cy.get('section#experience').should('be.visible');
  });
});
