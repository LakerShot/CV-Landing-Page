'use client';

import type Lenis from 'lenis';

/**
 * Module-level handle on the active Lenis instance.
 *
 * Anchor navigation and the mobile menu's scroll lock both need to talk to
 * Lenis, but neither sits under `SmoothScrollProvider` in the tree. A tiny
 * singleton is simpler than threading a context through the whole layout, and
 * every consumer already has to cope with `null` — that is the reduced-motion
 * path, where Lenis is deliberately never created.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}

/** Scroll to an element by id, falling back to native behaviour without Lenis. */
export function scrollToId(id: string, offset = -80) {
  const target = document.getElementById(id);
  if (!target) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.2 });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/** Jump back to the very top of the page. */
export function scrollToTop() {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/** Freeze/unfreeze scrolling — used while the mobile menu is open. */
export function setScrollLocked(locked: boolean) {
  const lenis = getLenis();
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.body.style.overflow = locked ? 'hidden' : '';
}
