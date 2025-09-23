import type { IAuthProvidersEntity } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IError } from 'oneentry/dist/base/utils';
import type { IBlockEntity } from 'oneentry/dist/blocks/blocksInterfaces';
import type { IFormsEntity } from 'oneentry/dist/forms/formsInterfaces';
import type {
  IOrderByMarkerEntity,
  IOrdersEntity,
} from 'oneentry/dist/orders/ordersInterfaces';
import type { IPositionBlock } from 'oneentry/dist/pages/pagesInterfaces';
import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';

// Generic type for API responses
export type ApiResponse<T> = T | IError;

// Generic hook response type
export interface UseApiHook<T> {
  data: T | null;
  isLoading: boolean;
  error: IError | null;
  refetch: () => void;
}

// Specific hook response types
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

// Generic hook function type
export type ApiHookFunction<T, P> = (params: P) => UseApiHook<T>;
