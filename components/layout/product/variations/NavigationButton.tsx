import ArrowLeftIcon from '@/components/icons/arrow-left';
import ArrowRightIcon from '@/components/icons/arrow-right';

interface NavigationButtonProps {
  direction: 'left' | 'right';
}

/**
 * Carousel navigation button
 *
 * @param direction - left|right
 *
 * @returns icon for button
 */
const NavigationButton: React.FC<NavigationButtonProps> = ({ direction }) => {
  return direction === 'left' ? <ArrowLeftIcon /> : <ArrowRightIcon />;
};

export default NavigationButton;
