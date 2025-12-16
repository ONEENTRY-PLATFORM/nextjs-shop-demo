/**
 * Configuration for social provider buttons
 *
 * This array contains the source paths and alt text for social sign-in
 * option icons. Used to render social authentication buttons.
 * @type {Array<{src: string, alt: string}>}
 */
export const socialProvidersButtons = [
  {
    src: '/icons/google.svg',
    alt: 'Social sign-in option 1',
  },
  {
    src: '/icons/google.svg',
    alt: 'Social sign-in option 2',
  },
];

/**
 * Configuration data for different block types used in the application
 */
export const blocksData = [
  // home_banner:
  {
    className: 'w-full max-sm:flex-col h-[175px]',
  },
  // offer_best_seller:
  {
    className:
      'w-full lg:w-[calc(33%-0.65rem)] md:w-[calc(50%-0.65rem)] h-[260px]',
  },
  // offer_promotion:
  {
    className:
      'w-full lg:w-[calc(33%-0.65rem)] md:w-[calc(50%-0.65rem)] h-[260px]',
  },
  // offer_offer_day:
  {
    className:
      'w-full lg:w-[calc(33%-0.65rem)] md:w-[calc(50%-0.65rem)] h-[260px]',
  },
  // offer_new_arrivals:
  {
    className: 'w-full md:w-[calc(50%-0.65rem)] h-[260px]',
  },
  // offer_youtube:
  {
    className: 'w-full lg:w-[calc(50%-0.65rem)] h-[260px]',
  },
];

/**
 * Color configurations for different block types
 *
 * This object maps block identifiers to their corresponding background color
 * classes and additional styling. Used to apply consistent color schemes
 * across different sections of the application.
 */
export const blocksColors = {
  home_banner: 'bg-purple-200 w-full max-sm:flex-col',
  offer_best_seller: 'bg-purple-600',
  offer_promotion: 'bg-orange-300',
  offer_offer_day: 'bg-purple-300',
  offer_new_arrivals: 'bg-teal-300',
  offer_youtube: 'bg-blue-200',
};
