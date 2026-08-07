/// <reference types="cypress" />

/**
 * The seven widths from the brief. `responsive.cy.ts` walks all of them; other
 * specs import the list when they need a specific one.
 */
export const BREAKPOINTS = [360, 768, 1024, 1440, 1600, 1920, 2560] as const;

/** Section anchors expected on the page, in document order. */
export const SECTION_IDS = [
  'about',
  'skills',
  'experience',
  'mentoring',
  'education',
  'contact',
] as const;
