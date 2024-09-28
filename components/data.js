export const blocksData = [
  // home_banner:
  {
    width: 'w-full max-sm:flex-col',
    height: 'h-[175px]',
  },
  // offer_best_seller:
  {
    width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
  },
  // offer_promotion:
  {
    width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
  },
  // offer_offer_day:
  {
    width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
  },
  // offer_new_arrivals:
  {
    width: 'w-full md:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
  },
  // offer_youtube:
  {
    width: 'w-full lg:w-[calc(_50%_-_0.65rem)]',
    height: 'h-[260px]',
  },
];
export const blocksColors = {
  home_banner: 'bg-amber-600 w-full max-sm:flex-col',
  offer_best_seller: 'bg-purple-600',
  offer_promotion: 'bg-blue-500',
  offer_offer_day: 'bg-lime-700',
  offer_new_arrivals: 'bg-teal-300',
  offer_youtube: 'bg-amber-300',
};

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

// timeSlots
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

// productRating
export const productRating = {
  rating: 4.7,
  reviewCount: 7979,
};

export const ratingsData = [
  { value: 87, barValue: 100, starCount: 5 },
  { value: 95, barValue: 80, starCount: 4 },
  { value: 21, barValue: 60, starCount: 3 },
  { value: 2, barValue: 30, starCount: 2 },
  { value: 0, barValue: 0, starCount: 1 },
];

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
