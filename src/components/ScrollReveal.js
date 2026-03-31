'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Define the observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, we can stop observing this specific element
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // 2. Query all elements that should reveal
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    // 3. Start observing
    revealElements.forEach(el => {
      // If it's already in the viewport or high up, reveal it immediately (optional but safer)
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('revealed');
      } else {
        observer.observe(el);
      }
    });

    // Cleanup function
    return () => {
      revealElements.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, [pathname]); // Re-run whenever the path changes

  return null; // This component doesn't render anything UI-wise
}
