'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useLayoutEffect } from 'react';

/**
 * Register GSAP plugins
 *
 * @returns void
 */
const RegisterGSAP = () => {
  useLayoutEffect(() => {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
  }, []);

  return null;
};

export default RegisterGSAP;
