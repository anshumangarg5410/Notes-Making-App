import React, { useRef, useState, useEffect } from 'react';
import dividerImg from '../../assets/divider.png';

export const SectionDivider = ({ className = '', id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dividerRef = useRef(null);

  useEffect(() => {
    const el = dividerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '60px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={dividerRef}
      id={id}
      aria-hidden="true"
      className={`w-full flex items-center justify-center py-2 sm:py-4 select-none overflow-hidden pointer-events-none transition-opacity duration-700 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      <div className="w-[88%] sm:w-[84%] md:w-[80%] lg:w-[78%] max-w-5xl flex items-center justify-center">
        <img
          src={dividerImg}
          alt=""
          loading="lazy"
          decoding="async"
          style={{ aspectRatio: '2172 / 724' }}
          className="w-full h-auto object-contain select-none pointer-events-none"
        />
      </div>
    </div>
  );
};

export default SectionDivider;
