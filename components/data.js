// footer menu
export const quickLinks = [
  {
    text: 'About us',
    href: '/about_us',
  },
  {
    text: 'Service',
    href: '/services',
  },
  {
    text: 'Treatment',
    href: '/treatment',
  },
  {
    text: 'Product',
    href: '/shop',
  },
  {
    text: 'Our experts',
    href: '/experts',
  },
  {
    text: 'Support',
    href: '/support',
  },
  {
    text: 'Contact',
    href: '/contact_us',
  },
];

export const infoLinks = [
  {
    text: 'Book online',
    href: '/book',
  },
  {
    text: 'Delivery',
    href: '/delivery',
  },
  {
    text: 'Offers & events',
    href: '/offers',
  },
  {
    text: 'Purchase a gift card',
    href: '/gifts',
  },
  {
    text: 'Pricing & package',
    href: '/package',
  },
  {
    text: 'Payments',
    href: '/payments',
  },
];

// forms
export const signUpFormFields = [
  {
    fieldType: 'email',
    isVisible: true,
    localizeInfos: {
      title: 'Your e-mail',
    },
    placeholder: 'info@example.com',
    marker: 'email_reg',
    required: false,
  },
  {
    fieldType: 'password',
    localizeInfos: {
      title: 'Create password',
    },
    placeholder: '•••••',
    marker: 'password_reg',
    required: false,
  },
  {
    fieldType: 'password',
    localizeInfos: {
      title: 'Confirm password',
    },
    placeholder: '•••••',
    marker: 'confirm_password',
    required: false,
  },
  {
    fieldType: 'text',
    localizeInfos: {
      title: 'First name',
    },
    placeholder: 'ONE',
    marker: 'name_reg',
    required: false,
  },
  {
    fieldType: 'text',
    localizeInfos: {
      title: 'Surname',
    },
    placeholder: 'ENTRY',
    marker: 'surname_reg',
    required: false,
  },
];

export const signInFormFields = [
  {
    fieldType: 'text',
    isVisible: true,
    localizeInfos: {
      title: 'Username',
    },
    placeholder: 'info@example.com',
    marker: 'email_reg',
    required: true,
  },
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
];

export const userFormFields = [
  {
    fieldType: 'text',
    isVisible: true,
    localizeInfos: {
      title: 'First name',
    },
    placeholder: 'ONE',
    marker: 'user_name',
    required: true,
  },
  {
    fieldType: 'text',
    isVisible: true,
    localizeInfos: {
      title: 'Surname',
    },
    placeholder: 'ONE',
    marker: 'user_surname',
    required: true,
  },
  {
    fieldType: 'email',
    isVisible: true,
    localizeInfos: {
      title: 'Enter your email',
    },
    placeholder: 'info@example.com',
    marker: 'email',
    required: true,
  },
  {
    fieldType: 'tel',
    isVisible: true,
    localizeInfos: {
      title: 'Phone number',
    },
    placeholder: '+91 (',
    marker: 'phone',
    required: true,
  },
];

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

export const forgotPasswordFormFields = [
  {
    fieldType: 'email',
    isVisible: true,
    localizeInfos: {
      title: 'Enter your email',
    },
    placeholder: 'info@example.com',
    marker: 'email_reg',
    required: true,
  },
];

export const paymentFormFields = [
  {
    fieldType: 'text',
    localizeInfos: {
      title: 'Card holder name',
    },
    placeholder: 'ONEENTRY',
    marker: 'holder_name',
    isVisible: true,
    required: true,
  },
  {
    fieldType: 'text',
    localizeInfos: {
      title: 'Card number',
    },
    placeholder: '2300 0000 0000 0000',
    marker: 'card_number',
    isVisible: true,
    required: true,
  },
  {
    fieldType: 'group',
    className: 'relative box-border flex shrink-0 flex-row justify-between',
    fields: [
      {
        fieldType: 'text',
        localizeInfos: {
          title: 'MM/YY',
        },
        placeholder: '09/32',
        marker: 'expiry_date',
        isVisible: true,
        required: true,
      },
      {
        fieldType: 'text',
        localizeInfos: {
          title: 'CVC',
        },
        placeholder: 'xxx',
        marker: 'card_cvc',
        isVisible: true,
        required: true,
      },
    ],
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
    name: 'Ahmet L.',
    avatarSrc: '',
    content:
      'Sit consequat laoreet arcu odio volutpat. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
    likeCount: 7,
    commentCount: 4,
    rating: 3,
  },
  {
    name: 'Ahmet M.',
    avatarSrc: '',
    content:
      'Lorem ipsum dolor sit amet consectetur. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
    likeCount: 17,
    commentCount: 0,
    rating: 2,
  },
  {
    name: 'Ahmet N.',
    avatarSrc: '',
    content:
      'Lorem ipsum dolor. Diam eget vitae vulputate integer volutpat nec. Iaculis neque tristique sed id ultrices sed. Pharetra duis eget adipiscing rhoncus diam sagittis turpis ac. Sit consequat quis enim ac platea gravida.',
    likeCount: 32,
    commentCount: 2,
    rating: 4,
  },
];

export const variationsItems = [
  {
    title: 'Red',
    imageSrc: '/images/catalog-img-1.svg',
  },
  {
    title: 'Blue',
    imageSrc: '/images/catalog-img-2.svg',
  },
  {
    title: 'Green',
    imageSrc: '/images/catalog-img-3.svg',
  },
  {
    title: 'Yellow',
    imageSrc: '/images/catalog-img-4.svg',
  },
  {
    title: 'Gray',
    imageSrc: '/images/catalog-img-4.svg',
  },
];

export const ratingsData = [
  { value: 87, barValue: 100, starCount: 5 },
  { value: 95, barValue: 80, starCount: 4 },
  { value: 21, barValue: 60, starCount: 3 },
  { value: 2, barValue: 30, starCount: 2 },
  { value: 0, barValue: 0, starCount: 1 },
];

// catalogCards
export const catalogCards = [
  {
    id: 1,
    isVisible: true,
    attributeValues: {
      title: {
        value: 'Catalog',
      },
      bg_web: {
        value: {
          downloadLink: '/images/catalog-img-1.svg',
        },
      },
      class_name: {
        value: 'bg-amber-600',
      },
      card_width: {
        value: 'w-full',
      },
      card_height: {
        value: 'h-[175px]',
      },
      link: {
        value: '/shop',
      },
      quote: {
        value: 'Endless posibilities in one system',
      },
    },
  },
  {
    id: 2,
    isVisible: true,
    attributeValues: {
      title: {
        value: 'BEST SELLER',
      },
      bg_web: {
        value: {
          downloadLink: '/images/catalog-img-2.svg',
        },
      },
      class_name: {
        value: 'bg-purple-600',
      },
      card_width: {
        value: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      },
      card_height: {
        value: 'h-[260px]',
      },
      link: {
        value: 'best',
      },
      stickers: {
        value: {
          extended: {
            value: {
              downloadLink: '',
            },
          },
        },
      },
    },
  },
  {
    id: 3,
    isVisible: true,
    attributeValues: {
      title: {
        value: 'PROMOTION',
      },
      bg_web: {
        value: {
          downloadLink: '/images/catalog-img-3.svg',
        },
      },
      class_name: {
        value: 'bg-blue-500',
      },
      card_width: {
        value: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      },
      card_height: {
        value: 'h-[260px]',
      },
      link: {
        value: 'promotion',
      },
      stickers: {
        value: {
          extended: {
            value: {
              downloadLink: '',
            },
          },
        },
      },
    },
  },
  {
    id: 4,
    isVisible: true,
    attributeValues: {
      title: {
        value: 'OFFER OF TODAY',
      },
      bg_web: {
        value: {
          downloadLink: '/images/catalog-img-4.svg',
        },
      },
      class_name: {
        value: 'bg-lime-700',
      },
      card_width: {
        value: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      },
      card_height: {
        value: 'h-[260px]',
      },
      link: {
        value: 'offer',
      },
      stickers: {
        value: {
          extended: {
            value: {
              downloadLink: '',
            },
          },
        },
      },
    },
  },
  {
    id: 5,
    isVisible: true,
    attributeValues: {
      title: {
        value: 'NEW ARRIVALS',
      },
      bg_web: {
        value: {
          downloadLink: '/images/catalog-img-5.svg',
        },
      },
      class_name: {
        value: 'bg-teal-300',
      },
      card_width: {
        value: 'w-full md:w-[calc(_50%_-_0.65rem)]',
      },
      card_height: {
        value: 'h-[260px]',
      },
      link: {
        value: 'new',
      },
      stickers: {
        value: {
          extended: {
            value: {
              downloadLink: '',
            },
          },
        },
      },
    },
  },
  {
    id: 6,
    isVisible: true,
    attributeValues: {
      title: {
        value: 'Join OUR COMMUNITY',
      },
      bg_web: {
        value: {
          downloadLink: '/images/catalog-img-6.svg',
        },
      },
      class_name: {
        value: 'bg-amber-300',
      },
      card_width: {
        value: 'w-full lg:w-[calc(_50%_-_0.65rem)]',
      },
      card_height: {
        value: 'h-[260px]',
      },
      link: {
        value: 'new',
      },
      stickers: {
        value: {
          extended: {
            value: {
              downloadLink: '',
            },
          },
        },
      },
    },
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
