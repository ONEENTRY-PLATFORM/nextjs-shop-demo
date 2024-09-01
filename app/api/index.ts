export { api, reDefine } from './api/api';
export {
  RTKApi,
  useGetAccountsQuery,
  useGetAuthProvidersQuery,
  useGetBlocksByPageUrlQuery,
  useGetFormByMarkerQuery,
  useGetOrderStorageByMarkerQuery,
  useGetPaymentSessionByIdQuery,
  useGetSingleOrderQuery,
  useGetUserOrdersQuery,
  useLazyGetFormByMarkerQuery,
  useLazyGetMeQuery,
  useLazyGetPaymentSessionByIdQuery,
} from './api/RTKApi';
export { useSetPaymentSession } from './hooks/setPaymentSession';
// eslint-disable-next-line import/no-cycle
// export { useGetMenu } from './hooks/trash/useGetMenu';
// export { useGetPage } from './hooks/trash/useGetPage';
// export { useGetPages } from './hooks/trash/useGetPages';
// export { useGetRelatedProducts } from './hooks/trash/useGetRelatedProducts';
export { useGetAttributesByMarker } from './hooks/useGetAttributesByMarker';
export { useGetBlockByMarker } from './hooks/useGetBlockByMarker';
export { useGetBlocksByProductId } from './hooks/useGetBlocksByProductId';
export { useGetBlocksByUrl } from './hooks/useGetBlocksByUrl';
export { useGetConfig } from './hooks/useGetConfig';
export { useGetForm } from './hooks/useGetForm';
export { useGetLocales } from './hooks/useGetLocales';
export { useGetProduct } from './hooks/useGetProduct';
export { useGetProductsByBlockMarker } from './hooks/useGetProductsByBlockMarker';
export { useGetSimilarProducts } from './hooks/useGetSimilarProducts';
export { useGetSingleAttributeByMarkerSet } from './hooks/useGetSingleAttributeByMarkerSet';
export { useGetStatus } from './hooks/useGetStatus';
export { useSetForm } from './hooks/useSetForm';
export { logInUser, logOutUser } from './utils/logInUser';
export { socket } from './utils/socket';
