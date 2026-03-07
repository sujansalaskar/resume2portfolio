import { useEffect, useRef } from "react";

/**
 * Lightweight scroll-reveal hook using IntersectionObserver.
 * Adds the 'revealed' class to child elements with [data-reveal] when
 * they scroll into the viewport, with staggered delays.
 *
 * Usage:
 *   const containerRef = useScrollReveal();
 *   <div ref={containerRef}>
 *     <div data-reveal>I fade in!</div>
 *     <div data-reveal>Me too, slightly later!</div>
 *   </div>
 */
export function useScrollReveal(options?: {
    threshold?: number;
    rootMargin?: string;
    staggerMs?: number;
}) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const threshold = options?.threshold ?? 0.15;
        const rootMargin = options?.rootMargin ?? "0px 0px -40px 0px";
        const staggerMs = options?.staggerMs ?? 80;

        const elements = container.querySelectorAll("[data-reveal]");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement;
                        el.style.transitionDelay = `${(Array.from(elements).indexOf(el) > -1 ? Array.from(elements).indexOf(el) : 0) * staggerMs}ms`;
                        el.classList.add("revealed");
                        observer.unobserve(el);
                    }
                });
            },
            { threshold, rootMargin }
        );

        elements.forEach((el) => observer.observe(el));

        // Use MutationObserver for dynamic content (like live preview typing)
        const mutationObserver = new MutationObserver(() => {
            const newElements = container.querySelectorAll("[data-reveal]:not(.revealed)");
            newElements.forEach((el) => observer.observe(el));
        });

        mutationObserver.observe(container, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, [options?.threshold, options?.rootMargin, options?.staggerMs]);

    return containerRef;
}

export default useScrollReveal;
