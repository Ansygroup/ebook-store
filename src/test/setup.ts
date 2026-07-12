import '@testing-library/jest-dom';

// jsdom does not implement scrollTo; stub it to keep test output clean.
window.scrollTo = () => {};

// Polyfills required by framer-motion in the jsdom test environment.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

if (!('IntersectionObserver' in window)) {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = '';
    thresholds = [];
  }
  // @ts-expect-error - assigning polyfill
  window.IntersectionObserver = IO;
}
