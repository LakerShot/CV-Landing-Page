describe('repro locale switch errors', () => {
  it('switches locale after scrolling through sections, on mobile viewport', () => {
    cy.viewport('iphone-x');
    cy.visit('/en');

    const uncaught: string[] = [];
    cy.on('uncaught:exception', (err) => {
      uncaught.push(err.message + '\n' + err.stack);
      return false;
    });

    cy.window().then((win) => {
      cy.spy(win.console, 'error').as('consoleError');
    });

    cy.scrollTo(0, 2000);
    cy.wait(600);
    cy.scrollTo(0, 4000);
    cy.wait(600);

    cy.contains('button', 'RU').click({ force: true });
    cy.wait(800);

    cy.window().then((win) => win.scrollTo(0, 0));
    cy.wait(300);

    cy.get('body').then(() => {
      cy.get('@consoleError').then((spy: unknown) => {
        const calls = (spy as sinon.SinonSpy)
          .getCalls()
          .map((c) => c.args.map((a) => String(a)).join(' '));
        cy.writeFile('cypress/repro-output.json', { uncaught, consoleErrors: calls });
      });
    });
  });
});
