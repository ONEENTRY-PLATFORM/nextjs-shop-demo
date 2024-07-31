import {createContext, ReactNode, useEffect} from 'react';
import {useAppDispatch} from '../store/hooks';
import {addContent, ContentType} from '../store/reducers/SystemContentSlice';
import {useGetSingleAttributeByMarkerSet, useGetBlockByMarker} from '../api';
import {IListTitle} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';

const ContentContext = createContext({});

type Props = {
  children: ReactNode;
};

export const ContentContextProvider = ({children}: Props) => {
  const {block} = useGetBlockByMarker({marker: 'system_content'});
  const {attributes} = useGetSingleAttributeByMarkerSet({
    setMarker: 'system_content',
    attributeMarker: 'cart_item_options',
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (block) {
      const systemContent: ContentType = {
        buttons: {
          addToCart: block?.attributeValues?.add_to_cart_button?.value,
          outOfStock: block?.attributeValues?.out_of_stock_button?.value,
        },
        currency: block?.attributeValues?.currency?.value,
        open_filters_button: block?.attributeValues?.open_filters_button?.value,
        empty_cart_plug: block?.attributeValues?.empty_cart_plug?.value,
        empty_favorites_plug:
          block?.attributeValues?.empty_favorites_plug?.value,
        cart_button_active: block?.attributeValues?.cart_button_active?.value,
        cart_item_options: attributes?.listTitles as IListTitle[],
        all_products_button: block?.attributeValues?.all_products_button?.value,
        content_not_found: block?.attributeValues?.content_not_found?.value,
        reset_button_placeholder:
          block?.attributeValues?.reset_button_placeholder?.value,
        apply_button_placeholder:
          block?.attributeValues?.apply_button_placeholder?.value,
        search_placeholder: block?.attributeValues?.search_placeholder?.value,
        search_history_title:
          block?.attributeValues?.search_history_title?.value,
        category_product_plug:
          block?.attributeValues?.category_product_plug?.value,
        contact_us_logo:
          block?.attributeValues?.contact_us_logo?.value[0]?.downloadLink,
        go_to_pay_placeholder:
          block?.attributeValues?.go_to_pay_placeholder?.value,
        units_plug: block?.attributeValues?.units_plug?.value,
        price_to: block?.attributeValues?.price_to?.value,
        price_from: block?.attributeValues?.price_from?.value,
        user_name_placeholder:
          block?.attributeValues?.user_name_placeholder?.value,
        user_phone_placeholder:
          block?.attributeValues?.user_phone_placeholder?.value,
        order_info_total: block?.attributeValues?.order_info_total?.value,
        order_info_quantity: block?.attributeValues?.order_info_quantity?.value,
        order_info_status: block?.attributeValues?.order_info_status?.value,
        order_info_amount: block?.attributeValues?.order_info_amount?.value,
        order_info_date_placeholder:
          block?.attributeValues?.order_info_date_placeholder?.value,
        order_info_time_placeholder:
          block?.attributeValues?.order_info_time_placeholder?.value,
        order_info_comment_placeholder:
          block?.attributeValues?.order_info_comment_placeholder?.value,
        order_info_address_placeholder:
          block?.attributeValues?.order_info_address_placeholder?.value,
        round_logo: block?.attributeValues?.round_logo?.value[0]?.downloadLink,
        log_out_button: block?.attributeValues?.log_out_button?.value,
        unsuccessful_payment_text: block?.attributeValues?.unsuccessful_payment_text?.value,
        successful_payment_text: block?.attributeValues?.successful_payment_text?.value,
        email_auth: block?.attributeValues?.email_auth?.value,
        auth_text: block?.attributeValues?.auth_text?.value,
        terms_text: block?.attributeValues?.terms_text?.value,
        success_alert: block?.attributeValues?.success_alert?.value,
      };
      dispatch(addContent(systemContent));
    }
  }, [block, attributes]);

  return <ContentContext.Provider value>{children}</ContentContext.Provider>;
};
