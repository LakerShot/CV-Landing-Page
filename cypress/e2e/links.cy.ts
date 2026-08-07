const EXTERNAL_HOSTS = ['linkedin.com', 'github.com', 'codesandbox.io', 't.me'];

describe('links and downloads', () => {
  beforeEach(() => {
    cy.visit('/en');
  });

  it('opens external profiles safely in a new tab', () => {
    EXTERNAL_HOSTS.forEach((host) => {
      cy.get(`a[href*="${host}"]`)
        .first()
        .should('have.attr', 'target', '_blank')
        .and('have.attr', 'rel')
        .and('match', /noopener/);
    });
  });

  it('exposes the email as a mailto link', () => {
    cy.get('a[href^="mailto:"]')
      .first()
      .should('have.attr', 'href', 'mailto:egormorozdev@outlook.com');
  });

  it('offers the CV as a download', () => {
    cy.get('a[href$=".pdf"]').first().should('have.attr', 'download');
  });

  it('serves the CV PDF and the portrait assets', () => {
    cy.request('/Egor_Morozov_CV.pdf').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.contain('pdf');
    });

    cy.request('/avatar.jpg').its('status').should('eq', 200);
    cy.request('/avatar-mask.png').its('status').should('eq', 200);
  });

  it('serves robots.txt and the sitemap listing both locales', () => {
    cy.request('/robots.txt').its('status').should('eq', 200);

    cy.request('/sitemap.xml').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.contain('/en');
      expect(response.body).to.contain('/ru');
    });
  });

  it('exposes Person structured data', () => {
    cy.get('script[type="application/ld+json"]')
      .should('exist')
      .invoke('text')
      .then((text) => {
        const data = JSON.parse(text);
        expect(data['@type']).to.eq('Person');
        expect(data.name).to.eq('Egor Morozov');
        expect(data.sameAs).to.have.length(4);
      });
  });
});
