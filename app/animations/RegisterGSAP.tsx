'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useLayoutEffect } from 'react';

// import GSDevTools from '@/app/animations/utils/GSDevTools';

const RegisterGSAP = () => {
  useLayoutEffect(() => {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
    // gsap.registerPlugin(GSDevTools);
    // GSDevTools.create();
  }, []);

  return null;
};

export default RegisterGSAP;
