'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  getTransition,
  removeProduct,
  setCartTransition,
} from '@/app/store/reducers/CartSlice';

import QuantitySelector from '../../product/components/QuantitySelector';
import DeleteButton from '../components/DeleteButton';

const ProductAnimations = ({
  children,
  className,
  product,
}: {
  children: ReactNode;
  className: string;
  product: IProductsEntity & {
    selected: boolean;
  };
}) => {
  const dispatch = useAppDispatch();
  const ref = useRef(null);
  const { transitionId } = useAppSelector(getTransition);

  // removeProduct
  useGSAP(() => {
    if (!ref.current || product.id !== transitionId) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
    });

    tl.to(ref.current, {
      autoAlpha: 0,
      height: 0,
      duration: 0.4,
      ease: 'power2.inOut',
    }).set(ref.current, {
      autoAlpha: 1,
      height: 'auto',
      onComplete: () => {
        dispatch(removeProduct(product.id));
        dispatch(
          setCartTransition({
            productId: 0,
          }),
        );
        toast('Product ' + product.localizeInfos.title + ' removed from cart!');
      },
    });
    tl.play();

    return () => {
      tl.kill();
    };
  }, [transitionId]);

  return (
    <div ref={ref} className={className}>
      {children}
      <div className="z-10 flex items-center gap-5 self-start text-xl font-bold leading-8 text-neutral-600 max-sm:ml-8 max-sm:flex">
        <QuantitySelector product={product} height={42} />
        <DeleteButton productId={product.id} />
      </div>
    </div>
  );
};

export default ProductAnimations;
