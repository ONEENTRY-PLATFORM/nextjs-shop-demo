'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useLayoutEffect } from 'react';

/**
 * Register GSAP plugins
 * @see {@link https://gsap.com/cheatsheet/#plugins- gsap cheatsheet}
 * @returns void
 */
const RegisterGSAP = () => {
  useLayoutEffect(() => {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
  }, []);

  return null;
};

export default RegisterGSAP;
