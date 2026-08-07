/**
 * The reduced-motion path is the one most likely to rot silently: it is never
 * exercised during normal development, and if it breaks the page is not merely
 * less animated — it is blank, because every reveal starts at opacity 0.
 */
function visitWithReducedMotion(path: string) {
  cy.visit(path, {
    onBeforeLoad(win) {
      const real = win.matchMedia.bind(win);
      cy.stub(win, 'matchMedia').callsFake((query: string) => {
        if (query.includes('prefers-reduced-motion')) {
          return {
            matches: query.includes('reduce'),
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
          } as unknown as MediaQueryList;
        }
        return real(query);
      });
    },
  });
}

describe('prefers-reduced-motion', () => {
  beforeEach(() => {
    visitWithReducedMotion('/en');
  });

  it('shows the hero heading at full opacity', () => {
    // Uppercase is applied with text-transform, so the text node is mixed case.
    cy.get('h1').should('be.visible').and('contain.text', 'Egor Morozov');
    cy.get('h1').should('have.css', 'opacity', '1');
  });

  it('does not hand scrolling over to Lenis', () => {
    // Lenis stamps these classes on <html> when it takes control.
    cy.get('html').should('not.have.class', 'lenis');
    cy.get('html').should('not.have.class', 'lenis-smooth');
  });

  it('leaves every section readable without animation', () => {
    ['skills', 'experience', 'mentoring', 'education', 'contact'].forEach((id) => {
      cy.get(`#${id}`).scrollIntoView();
      cy.get(`#${id}`).find('h2').should('be.visible').and('have.css', 'opacity', '1');
    });
  });

  it('still fills the skill bars to their real values', () => {
    cy.get('#skills').scrollIntoView();
    cy.get('[data-skill-fill]')
      .first()
      .should(($el) => {
        // scaleX(1) for the first bar, which is at 100.
        expect($el[0].style.transform || getComputedStyle($el[0]).transform).to.not.equal('none');
      });
  });

  it('reveals the tech tags rather than leaving them hidden', () => {
    cy.get('#skills').scrollIntoView();
    cy.contains('Storybook').should('be.visible');
    cy.contains('Clean Code/Architecture').should('be.visible');
  });
});
