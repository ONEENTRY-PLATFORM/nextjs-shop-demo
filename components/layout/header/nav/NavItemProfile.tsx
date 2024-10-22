'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useTransitionRouter } from 'next-transition-router';
import type { IMenusPages } from 'oneentry/dist/menus/menusInterfaces';
import type { FC } from 'react';
import { useContext, useRef, useState } from 'react';

import { logOutUser } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import ProfileIcon from '@/components/icons/profile';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const NavItemProfile: FC<{ item: any; lang: string; userMenu?: any }> = ({
  item,
  lang,
  userMenu,
}) => {
  const { open, setOpen, setComponent } = useContext(OpenDrawerContext);
  const { authenticate, isAuth } = useContext(AuthContext);
  const ref = useRef(null);
  const [state, setState] = useState(false);
  const pages = userMenu?.menu?.pages as Array<
    IMenusPages & { isActive: boolean }
  >;

  const router = useTransitionRouter();

  const onLogout = async () => {
    await logOutUser({ marker: 'email' });
    authenticate();
    router.push('/');
  };

  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
    });

    tl.from(ref.current, {
      autoAlpha: 0,
      height: 0,
    }).to(ref.current, {
      autoAlpha: 1,
      height: 'auto',
      duration: 0.5,
    });
    if (state) {
      tl.play();
    } else {
      tl.reverse(0.5);
    }

    return () => {
      tl.kill();
    };
  }, [state]);

  return !isAuth ? (
    <button
      onClick={() => {
        setOpen(!open);
        setComponent('SignInForm');
      }}
      title={item.localizeInfos.menuTitle}
      className="group relative box-border flex size-6 shrink-0"
    >
      <ProfileIcon />
    </button>
  ) : !userMenu ? (
    <Link
      href={'/' + lang + '/profile'}
      title={item.localizeInfos.menuTitle}
      className="group relative box-border flex size-6 shrink-0"
    >
      <ProfileIcon />
    </Link>
  ) : (
    <div className="relative z-50">
      <button
        title={'Profile'}
        className="group relative box-border flex size-6 shrink-0"
        onClick={() => setState(!state)}
        onPointerEnter={() => setState(true)}
      >
        <ProfileIcon />
      </button>
      <div
        ref={ref}
        onMouseLeave={() => setState(false)}
        className="absolute left-0 top-8 h-0 w-48 overflow-hidden rounded-md bg-white px-4 shadow-lg"
      >
        {userMenu?.menu && (
          <ul className="my-4">
            {pages.map((page, i) => {
              return (
                <li key={i}>
                  <Link
                    href={'/' + lang + '/' + page.pageUrl}
                    title={page.localizeInfos.menuTitle}
                    className="group relative box-border flex hover:text-orange-500"
                    onClick={() => setState(false)}
                  >
                    {page.localizeInfos.menuTitle}
                  </Link>
                </li>
              );
            })}
            {isAuth && (
              <li>
                <button
                  className={`group flex justify-start hover:text-orange-500`}
                  onClick={onLogout}
                >
                  <div>Logout</div>
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NavItemProfile;
