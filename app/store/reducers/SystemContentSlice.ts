import {CombinedState, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IListTitle} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';

type ButtonsType = {
  addToCart: string;
  outOfStock: string;
};

export type ContentType = {
  buttons: ButtonsType;
  empty_cart_plug: string;
  empty_favorites_plug: string;
  cart_button_active: string;
  open_filters_button: string;
  all_products_button: string;
  content_not_found: string;
  cart_item_options?: IListTitle[];
  reset_button_placeholder: string;
  apply_button_placeholder: string;
  search_history_title: string;
  search_placeholder: string;
  category_product_plug: string;
  contact_us_logo: string;
  currency: string;
  price_from: string;
  price_to: string;
  color_filters?: IListTitle[];
  go_to_pay_placeholder: string;
  unsuccessful_payment_text: string;
  successful_payment_text: string;
  email_auth: string;
  auth_text: string;
  units_plug: string;
  user_name_placeholder: string;
  user_phone_placeholder: string;
  order_info_total: string;
  order_info_quantity: string;
  order_info_status: string;
  order_info_amount: string;
  order_info_date_placeholder: string;
  order_info_time_placeholder: string;
  order_info_comment_placeholder: string;
  order_info_address_placeholder: string;
  terms_text: string;
  [key: string]: any;
};

type InitialStateType = {
  content: ContentType;
};
const initialState: InitialStateType = {
  content: {
    buttons: {
      addToCart: '',
      outOfStock: '',
    },
    empty_cart_plug: '',
    currency: '$',
    empty_favorites_plug: '',
    cart_button_active: '',
    cart_item_options: [],
    open_filters_button: '',
    all_products_button: '',
    content_not_found: '',
    reset_button_placeholder: '',
    apply_button_placeholder: '',
    search_placeholder: '',
    search_history_title: '',
    category_product_plug: '',
    contact_us_logo: '',
    terms_text: '',
    go_to_pay_placeholder: '',
    price_from: '',
    price_to: '',
    color_filters: [],
    units_plug: '',
    user_name_placeholder: '',
    user_phone_placeholder: '',
    order_info_total: '',
    order_info_quantity: '',
    order_info_status: '',
    order_info_amount: '',
    unsuccessful_payment_text: '',
    successful_payment_text: '',
    email_auth: '',
    auth_text: '',
    order_info_date_placeholder: '',
    order_info_time_placeholder: '',
    order_info_comment_placeholder: '',
    order_info_address_placeholder: '',
  },
};

export const systemContentSlice = createSlice({
  name: 'featured-object-slice',
  initialState,
  reducers: {
    addContent(state, action: PayloadAction<ContentType>) {
      state.content = action.payload;
    },
  },
});

export const getFeaturedButtonContent = (
  state: CombinedState<{featuredObjectReducer: InitialStateType}>,
) => {
  return state.featuredObjectReducer.content.buttons;
};

export const {addContent} = systemContentSlice.actions;

export default systemContentSlice.reducer;
