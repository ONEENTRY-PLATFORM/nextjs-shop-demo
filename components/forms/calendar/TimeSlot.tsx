import type { Dispatch, JSX, SetStateAction } from 'react';

/**
 * Time slot button component for selecting a specific time slot.
 * Renders a button representing a time slot with different styles based on its state.
 * @param   {object}                           props                 - Time slot props.
 * @param   {object}                           props.slot            - Time slot object. It contains time and isDisabled properties.
 * @param   {string}                           props.slot.time       - Time value
 * @param   {boolean}                          props.slot.isDisabled - Disabled state
 * @param   {string}                           props.currentTime     - Current time. It is used to determine which time slot is currently selected.
 * @param   {Dispatch<SetStateAction<string>>} props.setTime         - Set time. It is used to update the selected time.
 * @returns {JSX.Element}                                            Time slot button.
 */
const TimeSlot = ({
  slot,
  currentTime,
  setTime,
}: {
  slot: {
    time: string;
    isDisabled?: boolean;
  };
  currentTime: string;
  setTime: Dispatch<SetStateAction<string>>;
}): JSX.Element => {
  /** Destructure slot properties for easier access */
  const { isDisabled, time } = slot;

  /** Base CSS classes for the time slot button */
  let className =
    'px-2 py-1.5 rounded-3xl border-2 text-center text-xs cursor-pointer ';

  /**
   * Apply different CSS classes based on the slot's state:
   * 1. If current time matches slot time - selected state
   * 2. If slot is disabled - disabled state
   * 3. Otherwise - default state with hover effects
   */
  if (currentTime === time) {
    className += 'text-white bg-orange-500 border-orange-500';
  } else if (isDisabled) {
    className += 'border-solid border-slate-300 text-slate-300';
  } else {
    className +=
      'border-orange-500 border-solid hover:border-red-500 hover:text-red-500';
  }

  /**
   * Button element representing a time slot
   * Updates the selected time when clicked and is disabled when isDisabled is true
   * @returns {JSX.Element} - Button element
   */
  return (
    <button
      className={className}
      onClick={() => setTime(time)}
      disabled={isDisabled}
    >
      <time>{time}</time>
    </button>
  );
};

export default TimeSlot;
