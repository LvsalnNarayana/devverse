// React
import { useEffect, useState } from 'react';

/**
 * useActiveSection — scroll-spy hook.
 *
 * Watches a list of DOM ids using IntersectionObserver and returns the id
 * of the section currently "in view". The `rootMargin` is tuned so that a
 * section becomes active once its heading crosses ~25% from the viewport
 * top, which feels natural while scrolling long articles.
 *
 * @param {string[]} sectionIds  Ordered list of section element ids.
 * @param {object}   [options]
 * @param {string}   [options.rootMargin='-25% 0px -65% 0px']
 * @param {number|number[]} [options.threshold=0]
 * @returns {string|null} id of the active section, or null before mount.
 */
export default function useActiveSection(sectionIds, options = {}) {
  const { rootMargin = '-25% 0px -65% 0px', threshold = 0 } = options;
  const idsKey = Array.isArray(sectionIds) ? sectionIds.join('|') : '';

  const [activeId, setActiveId] = useState(
    Array.isArray(sectionIds) && sectionIds.length > 0 ? sectionIds[0] : null,
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return undefined;
    }

    const ids = idsKey ? idsKey.split('|') : [];
    if (ids.length === 0) return undefined;

    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);

    if (elements.length === 0) return undefined;

    // Track which ids are currently intersecting; pick the topmost one as
    // active so we don't flicker between adjacent sections.
    const intersecting = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id);
          } else {
            intersecting.delete(entry.target.id);
          }
        });

        if (intersecting.size > 0) {
          // Use the order from `ids` (document order) to pick the topmost.
          const next = ids.find((id) => intersecting.has(id));
          if (next) setActiveId(next);
          return;
        }

        // No section is "active" by the rootMargin threshold — fall back to
        // whichever section's top is closest to (and above) the viewport top.
        const scrollY = window.scrollY || window.pageYOffset;
        let best = null;
        let bestTop = -Infinity;
        elements.forEach((el) => {
          const top = el.getBoundingClientRect().top + scrollY;
          if (top <= scrollY + 120 && top > bestTop) {
            bestTop = top;
            best = el.id;
          }
        });
        if (best) setActiveId(best);
      },
      { rootMargin, threshold },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idsKey, rootMargin, threshold]);

  return activeId;
}
