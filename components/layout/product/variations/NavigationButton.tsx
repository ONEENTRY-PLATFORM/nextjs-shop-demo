import type { JSX } from 'react';

import ArrowLeftIcon from '@/components/icons/arrow-left';
import ArrowRightIcon from '@/components/icons/arrow-right';

/**
 * NavigationButton component renders an arrow icon for carousel navigation.
 * Depending on the direction prop, it displays either a left or right arrow icon.
 * This component is used to provide navigation controls for product carousels.
 * @param   {object}         props           - Component properties
 * @param   {'left'|'right'} props.direction - Determines which arrow icon to display ('left' or 'right')
 * @returns {JSX.Element}                    An arrow icon component (either left or right) for carousel navigation
 */
const NavigationButton = ({
  direction,
}: {
  direction: 'left' | 'right';
}): JSX.Element => {
  return direction === 'left' ? <ArrowLeftIcon /> : <ArrowRightIcon />;
};

export default NavigationButton;
