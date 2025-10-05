'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import type { JSX } from 'react';
import { useLayoutEffect } from 'react';

/**
 * Register GSAP plugins
 * @see {@link https://gsap.com/cheatsheet/#plugins- gsap cheatsheet}
 * @returns {JSX.Element} - Empty component
 */
const RegisterGSAP = (): JSX.Element => {
  useLayoutEffect(() => {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
    gsap.registerPlugin(ScrollToPlugin);
  }, []);

  return <></>;
};

export default RegisterGSAP;
