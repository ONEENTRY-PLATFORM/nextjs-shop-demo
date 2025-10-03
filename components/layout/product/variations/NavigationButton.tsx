import type { JSX } from 'react';

import ArrowLeftIcon from '@/components/icons/arrow-left';
import ArrowRightIcon from '@/components/icons/arrow-right';

interface NavigationButtonProps {
  direction: 'left' | 'right';
}

/**
 * Carousel navigation button.
 *
 * @param direction - left|right.
 *
 * @returns Carousel navigation button.
 */

const NavigationButton = ({
  direction,
}: NavigationButtonProps): JSX.Element => {
  return direction === 'left' ? <ArrowLeftIcon /> : <ArrowRightIcon />;
};

export default NavigationButton;
