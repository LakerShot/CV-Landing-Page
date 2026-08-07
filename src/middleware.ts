import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  /*
   * Run on everything except Next internals and files with an extension
   * (avatar.jpg, avatar-mask.png, the CV PDF, favicon, sitemap, robots...).
   */
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
