/**
 * A social sign-in button configuration entry.
 * @property {string} src - Path to the provider icon.
 * @property {string} alt - Accessible alt text for the icon.
 */
export type SocialProviderButton = {
  src: string;
  alt: string;
};

/**
 * Layout configuration for a single home-page block card.
 * @property {string} className - Tailwind classes defining the card's grid sizing.
 */
export type BlockData = {
  className: string;
};

/**
 * Configuration for social provider buttons
 *
 * This array contains the source paths and alt text for social sign-in
 * option icons. Used to render social authentication buttons.
 */
export const socialProvidersButtons: SocialProviderButton[] = [
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
export const blocksData: BlockData[] = [
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
export const blocksColors: Record<string, string> = {
  home_banner: 'bg-purple-200 w-full max-sm:flex-col',
  offer_best_seller: 'bg-orange-300',
  offer_promotion: 'bg-blue-200',
  offer_offer_day: 'bg-purple-300',
  offer_new_arrivals: 'bg-purple-300',
  offer_youtube: 'bg-teal-300',
};
