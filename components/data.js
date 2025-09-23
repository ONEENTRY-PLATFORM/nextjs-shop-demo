/**
 * Configuration data for different block types used in the application
 *
 * This array contains width and height configurations for various block types
 * used throughout the application. Each entry corresponds to a specific block
 * identifier and contains CSS classes for styling.
 *
 * @type {Array<{width: string, height: string}>}
 */
export const blocksData = [
  // home_banner:
  {
    width: 'w-full max-sm:flex-col',
    height: 'h-[175px]',
  },
  // offer_best_seller:
  {
    width: 'w-full lg:w-[calc(33%-0.65rem)] md:w-[calc(50%-0.65rem)]',
    height: 'h-[260px]',
  },
  // offer_promotion:
  {
    width: 'w-full lg:w-[calc(33%-0.65rem)] md:w-[calc(50%-0.65rem)]',
    height: 'h-[260px]',
  },
  // offer_offer_day:
  {
    width: 'w-full lg:w-[calc(33%-0.65rem)] md:w-[calc(50%-0.65rem)]',
    height: 'h-[260px]',
  },
  // offer_new_arrivals:
  {
    width: 'w-full md:w-[calc(50%-0.65rem)]',
    height: 'h-[260px]',
  },
  // offer_youtube:
  {
    width: 'w-full lg:w-[calc(50%-0.65rem)]',
    height: 'h-[260px]',
  },
];

/**
 * Color configurations for different block types
 *
 * This object maps block identifiers to their corresponding background color
 * classes and additional styling. Used to apply consistent color schemes
 * across different sections of the application.
 *
 * @type {Object.<string, string>}
 */
export const blocksColors = {
  home_banner: 'bg-purple-200 w-full max-sm:flex-col',
  offer_best_seller: 'bg-purple-600',
  offer_promotion: 'bg-orange-300',
  offer_offer_day: 'bg-purple-300',
  offer_new_arrivals: 'bg-teal-300',
  offer_youtube: 'bg-blue-200',
};

/**
 * Form field configurations for the reset password form
 *
 * This array defines the structure and properties of form fields used in
 * the reset password functionality. Each field includes type, visibility,
 * localization, placeholder, marker, and required status information.
 *
 * @type {Array<Object>}
 */
export const resetPasswordFormFields = [
  {
    fieldType: 'password',
    isVisible: true,
    localizeInfos: {
      title: 'Password',
    },
    placeholder: '•••••',
    marker: 'password_reg',
    required: true,
  },
  {
    fieldType: 'password',
    isVisible: true,
    localizeInfos: {
      title: 'Confirm password',
    },
    placeholder: '•••••',
    marker: 'password_confirm',
    required: true,
  },
];

/**
 * Configuration for social provider buttons
 *
 * This array contains the source paths and alt text for social sign-in
 * option icons. Used to render social authentication buttons.
 *
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
 * Time slots data for delivery or appointment scheduling
 *
 * This array contains time slot information with properties indicating
 * availability and selection status. Used in scheduling components to
 * display available time options.
 *
 * @type {Array<{time: string, isDisabled?: boolean, isSelected?: boolean}>}
 */
export const timeSlotsData = [
  {
    time: '10:00',
  },
  {
    time: '11:00',
    isDisabled: true,
  },
  {
    time: '12:00',
  },
  {
    time: '13:00',
  },
  {
    time: '14:00',
  },
  {
    time: '15:00',
  },
  {
    time: '16:00',
  },
  {
    time: '17:00',
    isDisabled: true,
  },
  {
    time: '18:00',
    isDisabled: true,
  },
  {
    time: '19:00',
    isSelected: true,
  },
  {
    time: '20:00',
  },
  {
    time: '21:00',
  },
];

/**
 * Product rating information
 *
 * This object contains overall product rating data including average rating
 * and total review count. Used to display product ratings in the UI.
 *
 * @type {{rating: number, reviewCount: number}}
 */
export const productRating = {
  rating: 4.7,
  reviewCount: 7979,
};

/**
 * Detailed ratings data for product reviews
 *
 * This array contains detailed breakdown of product ratings by star count,
 * including value, bar value, and star count information. Used to display
 * rating distribution charts.
 *
 * @type {Array<{value: number, barValue: number, starCount: number}>}
 */
export const ratingsData = [
  { value: 87, barValue: 100, starCount: 5 },
  { value: 95, barValue: 80, starCount: 4 },
  { value: 21, barValue: 60, starCount: 3 },
  { value: 2, barValue: 30, starCount: 2 },
  { value: 0, barValue: 0, starCount: 1 },
];

/**
 * Sample product reviews data
 *
 * This array contains sample product review data including reviewer name,
 * avatar, content, like count, comment count, and rating. Used for
 * displaying product reviews in the UI.
 *
 * @type {Array<{name: string, avatarSrc: string, content: string, likeCount: number, commentCount: number, rating: number}>}
 */
export const reviewsData = [
  {
    name: 'Ahmet K.',
    avatarSrc: '',
    content:
      'Lorem ipsum dolor sit amet consectetur. Sit consequat laoreet arcu odio volutpat. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
    likeCount: 17,
    commentCount: 0,
    rating: 5,
  },
  {
    name: 'Sit consequat',
    avatarSrc: '',
    content:
      'Sit consequat laoreet arcu odio volutpat. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
    likeCount: 7,
    commentCount: 4,
    rating: 3,
  },
  {
    name: 'Diam eget',
    avatarSrc: '',
    content:
      'Lorem ipsum dolor sit amet consectetur. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
    likeCount: 17,
    commentCount: 0,
    rating: 2,
  },
  {
    name: 'Lorem ipsum',
    avatarSrc: '',
    content:
      'Lorem ipsum dolor. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
    likeCount: 32,
    commentCount: 2,
    rating: 4,
  },
];
