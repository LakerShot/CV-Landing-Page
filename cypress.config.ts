import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: false,
    viewportWidth: 1440,
    viewportHeight: 900,
    /*
     * The hero runs a mount timeline, so give the first assertions a little room
     * on a cold Next.js start without inflating every command's timeout.
     */
    defaultCommandTimeout: 8000,
    retries: { runMode: 1, openMode: 0 },
  },
});
