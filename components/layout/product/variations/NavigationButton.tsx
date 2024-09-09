import ArrowLeftIcon from '@/components/icons/arrow-left';
import ArrowRightIcon from '@/components/icons/arrow-right';

interface NavigationButtonProps {
  direction: 'left' | 'right';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  direction,
  action,
}) => {
  const altText = `Navigate ${direction}`;

  return (
    <button
      type="button"
      className={
        'group flex aspect-square w-8 items-center justify-center rounded-full border border-neutral-200 bg-white p-2'
      }
      onClick={action}
    >
      {direction === 'left' ? <ArrowLeftIcon /> : <ArrowRightIcon />}
    </button>
  );
};

export default NavigationButton;
