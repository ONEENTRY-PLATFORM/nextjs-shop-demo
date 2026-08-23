import type {
  IAccountsEntity,
  IAuthProvidersEntity,
  IBlockEntity,
  IError,
  IFormsEntity,
  IOrderByMarkerEntity,
  IOrdersEntity,
  IPositionBlock,
  IProductsEntity,
  IUserEntity,
} from 'oneentry/types';

/** Generic type for API responses */
export type ApiResponse<T> = T | IError;

/** Generic hook response type */
export interface UseApiHook<T> {
  data: T | null;
  isLoading: boolean;
  error: IError | null;
  refetch: () => void;
}

/** Specific hook response types */
export type UseProductById = UseApiHook<IProductsEntity>;
export type UseProductsByIds = UseApiHook<IProductsEntity[]>;
export type UseBlockByMarker = UseApiHook<IBlockEntity>;
export type UseBlocksByPageUrl = UseApiHook<IPositionBlock[]>;
export type UseFormByMarker = UseApiHook<IFormsEntity>;
export type UseAuthProviders = UseApiHook<IAuthProvidersEntity[]>;
export type UseUser = UseApiHook<IUserEntity>;
export type UseAccounts = UseApiHook<IAccountsEntity[]>;
export type UseOrderStorageByMarker = UseApiHook<IOrdersEntity>;
export type UseSingleOrder = UseApiHook<IOrderByMarkerEntity>;

/** Generic hook function type */
export type ApiHookFunction<T, P> = (params: P) => UseApiHook<T>;
