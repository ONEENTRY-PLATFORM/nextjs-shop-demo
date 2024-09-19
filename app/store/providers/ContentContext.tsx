'use client';

import type { IListTitle } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { ReactNode } from 'react';
import { createContext, useEffect } from 'react';

import {
  useGetBlockByMarkerQuery,
  useGetSingleAttributeByMarkerSet,
} from '@/app/api';
import { useAppDispatch } from '@/app/store/hooks';
import type { ContentType } from '@/app/store/reducers/SystemContentSlice';
import { addContent } from '@/app/store/reducers/SystemContentSlice';

const ContentContext = createContext({});

type Props = {
  children: ReactNode;
};

export const ContentContextProvider = ({ children }: Props) => {
  const { data } = useGetBlockByMarkerQuery({
    marker: 'system_content',
    activeLang: 'en_US',
  });
  const { attributes } = useGetSingleAttributeByMarkerSet({
    setMarker: 'system_content',
    attributeMarker: 'cart_item_options',
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      const { attributeValues } = data;
      const systemContent: ContentType = {
        buttons: {
          addToCart: attributeValues?.add_to_cart_button?.value,
          outOfStock: attributeValues?.out_of_stock_button?.value,
        },
        currency: attributeValues?.currency?.value,
        open_filters_button: attributeValues?.open_filters_button?.value,
        empty_cart_plug: attributeValues?.empty_cart_plug?.value,
        empty_favorites_plug: attributeValues?.empty_favorites_plug?.value,
        cart_button_active: attributeValues?.cart_button_active?.value,
        cart_item_options: attributes?.listTitles as IListTitle[],
        all_products_button: attributeValues?.all_products_button?.value,
        content_not_found: attributeValues?.content_not_found?.value,
        reset_button_placeholder:
          attributeValues?.reset_button_placeholder?.value,
        apply_button_placeholder:
          attributeValues?.apply_button_placeholder?.value,
        search_placeholder: attributeValues?.search_placeholder?.value,
        search_history_title: attributeValues?.search_history_title?.value,
        category_product_plug: attributeValues?.category_product_plug?.value,
        contact_us_logo:
          attributeValues?.contact_us_logo?.value[0]?.downloadLink,
        go_to_pay_placeholder: attributeValues?.go_to_pay_placeholder?.value,
        units_plug: attributeValues?.units_plug?.value,
        price_to: attributeValues?.price_to?.value,
        price_from: attributeValues?.price_from?.value,
        user_name_placeholder: attributeValues?.user_name_placeholder?.value,
        user_phone_placeholder: attributeValues?.user_phone_placeholder?.value,
        order_info_total: attributeValues?.order_info_total?.value,
        order_info_quantity: attributeValues?.order_info_quantity?.value,
        order_info_status: attributeValues?.order_info_status?.value,
        order_info_amount: attributeValues?.order_info_amount?.value,
        order_info_date_placeholder:
          attributeValues?.order_info_date_placeholder?.value,
        order_info_time_placeholder:
          attributeValues?.order_info_time_placeholder?.value,
        order_info_comment_placeholder:
          attributeValues?.order_info_comment_placeholder?.value,
        order_info_address_placeholder:
          attributeValues?.order_info_address_placeholder?.value,
        round_logo: attributeValues?.round_logo?.value[0]?.downloadLink,
        log_out_button: attributeValues?.log_out_button?.value,
        unsuccessful_payment_text:
          attributeValues?.unsuccessful_payment_text?.value,
        successful_payment_text:
          attributeValues?.successful_payment_text?.value,
        email_auth: attributeValues?.email_auth?.value,
        auth_text: attributeValues?.auth_text?.value,
        terms_text: attributeValues?.terms_text?.value,
        success_alert: attributeValues?.success_alert?.value,
      };
      dispatch(addContent(systemContent));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, attributes]);

  return <ContentContext.Provider value>{children}</ContentContext.Provider>;
};
