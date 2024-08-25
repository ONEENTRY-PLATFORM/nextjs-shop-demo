import Link from 'next/link';

import { getAttributeByMarker } from '@/app/api/serverSideProps';

import NavigationMenuItem from './NavigationMenuItem';

const NavigationMenu: React.FC = async () => {
  const stickersData = await getAttributeByMarker({
    attributeMarker: 'stickers',
    setMarker: 'product',
    langCode: 'en_US',
  });
  const stickers = stickersData.attribute?.listTitles.map(
    (sticker: { title: string; value: string }) => {
      return {
        label: sticker.title,
        href: '/shop/' + sticker.value,
      };
    },
  );

  const categoryData = await getAttributeByMarker({
    attributeMarker: 'category',
    setMarker: 'product',
    langCode: 'en_US',
  });
  const categories = categoryData.attribute?.listTitles.map(
    (category: { title: string; value: string }) => {
      return {
        label: category.title,
        href: '/shop/category/' + category.value,
      };
    },
  );

  const navigationItems = [
    {
      label: 'Category',
      href: '#',
      hasDropdown: true,
      categories: categories,
    },
  ];
  navigationItems.push(...stickers);

  return (
    <nav className="relative z-20 flex items-center justify-center border border-solid border-neutral-100 bg-white px-5 text-lg font-bold uppercase text-neutral-600 max-lg:text-sm max-md:px-5 max-md:text-sm">
      <div className="flex w-full max-w-screen-xl items-center justify-center py-7 max-md:px-5">
        <ul className="flex w-full justify-between gap-5 max-md:flex-wrap">
          {navigationItems.map((item, index) => (
            <li
              key={index}
              className="group my-auto flex justify-between gap-5 whitespace-nowrap py-1"
            >
              <NavigationMenuItem
                label={item.label}
                href={item.href}
                hasDropdown={item.hasDropdown}
              />

              {item.hasDropdown && (
                <ul className="absolute z-10 mt-6 hidden flex-col gap-4 bg-white px-6 py-8 leading-8 shadow-lg group-hover:flex">
                  {item.categories?.map(
                    (
                      it: {
                        href: string;
                        label: string;
                      },
                      i: React.Key,
                    ) => {
                      return (
                        <li key={i}>
                          <Link
                            href={it.href}
                            className="transition-colors duration-300 ease-in-out focus:outline-none"
                          >
                            {it.label}
                          </Link>
                        </li>
                      );
                    },
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationMenu;
