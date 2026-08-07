describe('internationalisation', () => {
  it('serves English at /en', () => {
    cy.visit('/en');
    cy.get('html').should('have.attr', 'lang', 'en');
    cy.contains('Experience').should('exist');
  });

  it('serves Russian at /ru', () => {
    cy.visit('/ru');
    cy.get('html').should('have.attr', 'lang', 'ru');
    cy.contains('Опыт работы').should('exist');
    cy.contains('Навыки').should('exist');
  });

  it('redirects the bare root to the default locale', () => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/en');
  });

  it('switches locale from the header and stays on the page', () => {
    cy.visit('/en');
    cy.contains('button', 'RU').click();
    cy.location('pathname').should('eq', '/ru');
    cy.get('html').should('have.attr', 'lang', 'ru');

    cy.contains('button', 'EN').click();
    cy.location('pathname').should('eq', '/en');
  });

  it('declares hreflang alternates for both locales', () => {
    cy.visit('/en');
    cy.get('link[rel="alternate"][hreflang="en"]').should('exist');
    cy.get('link[rel="alternate"][hreflang="ru"]').should('exist');
    cy.get('link[rel="alternate"][hreflang="x-default"]').should('exist');
  });

  it('translates section copy, not just the navigation', () => {
    cy.visit('/ru');
    cy.contains('section#experience', 'Манила, Филиппины').should('exist');
    cy.contains('section#education', 'Заочно').should('exist');
  });

  it('leaves no untranslated message keys on the page', () => {
    // A missing key renders as its dotted path, e.g. "experience.items.salmon.role".
    ['/en', '/ru'].forEach((path) => {
      cy.visit(path);
      cy.get('main')
        .invoke('text')
        .should('not.match', /\b[a-z]+(\.[a-zA-Z]+){2,}\b/);
    });
  });
});
