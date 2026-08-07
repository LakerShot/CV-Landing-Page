import { BREAKPOINTS, SECTION_IDS } from '../support/e2e';

describe('responsive layout', () => {
  BREAKPOINTS.forEach((width) => {
    describe(`${width}px`, () => {
      beforeEach(() => {
        cy.viewport(width, 900);
        cy.visit('/en');
      });

      it('does not scroll horizontally', () => {
        cy.document().then((doc) => {
          const el = doc.documentElement;
          expect(el.scrollWidth, `scrollWidth at ${width}px`).to.be.at.most(el.clientWidth);
        });
      });

      it('keeps every visible element inside the viewport', () => {
        /*
         * `body { overflow-x: hidden }` hides real overflow from scrollWidth, so
         * the check above can pass while content is clipped off-screen. Walking
         * the boxes is what actually catches an element busting out of the
         * container at one width but not the others.
         */
        cy.get('body *:not(script):not(style):not(noscript)').then(($els) => {
          const offenders: string[] = [];

          $els.each((_, el) => {
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return;
            // Decorative blurs are intentionally allowed to bleed.
            if (el.getAttribute('aria-hidden') === 'true') return;

            if (rect.right > width + 1 || rect.left < -1) {
              offenders.push(
                `${el.tagName.toLowerCase()}.${el.className.toString().split(' ')[0]} ` +
                  `(left ${Math.round(rect.left)}, right ${Math.round(rect.right)})`,
              );
            }
          });

          expect(offenders.slice(0, 8), `overflowing elements at ${width}px`).to.deep.equal([]);
        });
      });

      it('renders every section', () => {
        SECTION_IDS.forEach((id) => {
          cy.get(`section#${id}`).should('exist');
        });
      });

      it('keeps the portrait inside the viewport', () => {
        cy.get('img[alt*="Egor Morozov"]').then(($img) => {
          const rect = $img[0].getBoundingClientRect();
          expect(rect.left).to.be.at.least(-1);
          expect(rect.right).to.be.at.most(width + 1);
        });
      });
    });
  });

  it('shows the burger menu below the lg breakpoint and the inline nav above it', () => {
    cy.visit('/en');

    cy.viewport(360, 780);
    cy.get('button[aria-label="Open menu"]').should('be.visible');

    cy.viewport(1440, 900);
    cy.get('button[aria-label="Open menu"]').should('not.be.visible');
    cy.contains('nav button', 'Skills').should('be.visible');
  });

  it('opens and closes the mobile menu', () => {
    cy.viewport(360, 780);
    cy.visit('/en');

    cy.get('button[aria-label="Open menu"]').click();
    cy.get('[data-mobile-menu]').should('be.visible');

    // Scoped to the overlay: the desktop nav has a button with the same label,
    // it is just hidden at this width.
    cy.get('[data-mobile-menu]').contains('button', 'Education').click();
    cy.get('[data-mobile-menu]').should('not.exist');
  });
});
