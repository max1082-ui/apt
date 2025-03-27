import type {PublicKeyData, RejectReason} from '@services/types';
import {StoredCartData} from '@state/types';
import {SectionListData} from 'react-native';

//#region COMMON
export type Entry<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];
export type Entries<T> = Entry<T>[];

export type Dictionary<ValueT, KeyT extends string | number = string> = {
  [K in KeyT]: ValueT;
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type LoadingStatus = 'pending' | 'error' | 'idle';

export type ProductListContentType = 'sale' | 'stock';
//#endregion

//#region COMPONENTS
export type SelectListModalRefObject = {
  show: () => void;
  dismiss: () => void;
};
export type PickPointMapModalRefObject = {
  open: (dataSource: PickPoint) => void;
  dismiss: () => void;
  selectedPickPointId?: number;
};
export type ProductListHeaderSearchRefObject = {
  query: string;
  reset: () => void;
};
//#endregion

//#region OAUTH
export type RequestAccessTokensRequestParams = PublicKeyData;
export type RequestAccessTokensResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshAccessTokenRequestParams = PublicKeyData & {
  refreshToken: string;
};
export type RefreshAccessTokenResponse = {
  accessToken: string;
};
//#endregion

//#region USER
export type UserAuthData = {
  id: number;
};

export type UserPersonalData = {
  fio: string;
  email: string;
  phone: string;
};

export type UserFavoriteProductsData = {
  favoriteProducts: FavoriteData;
};

export type UserFavoritePharmacyData = {
  favoritePharmacy: FavoriteData;
};

export type UserDefaultStoreData = {
  defaultPharmacy: number;
};

export type UserDefaultStoreResponseData = {
  defaultPharmacy: DefaultStore;
};

export type User = UserAuthData & UserPersonalData;

export type UserUpdateFormResult = UserPersonalData;

export type UserUpdateErrorFieldName = keyof UserPersonalData;

export type UserUpdateErrorFields = {
  emptyField?: UserUpdateErrorFieldName[];
  noUniqueField?: UserUpdateErrorFieldName[];
  errorField?: UserUpdateErrorFieldName[];
};

export type GetUserRequestParams = undefined;
export type GetUserResponse = User &
  UserFavoriteProductsData &
  UserFavoritePharmacyData;

export type PatchUserRequestParams = Partial<
  UserPersonalData & UserFavoritePharmacyData & UserFavoriteProductsData
>;
export type PatchUserResponse = undefined;
// export type UserUpdateRequestParams = FormData;
// export type UserUpdateResponse = {
//   isUpdate: boolean;
//   userData?: User;
// } & UserUpdateErrorFields;
export type LogoutUserRequestParams = undefined;
export type LogoutUserResponse = undefined;

export type DeleteAccountRequestParams = undefined;
export type DeleteAccountResponse = undefined;
//#endregion

//#region NOTIFICATIONS
export type NotificationsFcmTokenRequestParams = {fcmToken?: string};
export type NotificationsFcmTokenResponse = {subscribed: boolean};
//#endregion

//#region AUTHORIZE
export type AuthorizeUserRequestParams = {
  phone: string;
};
export type AuthorizeUserResponse = {
  id: number;
};

export type AuthResponse = {
  userToken: string;
  userData: User;
};

export type AuthVerificationRequestParams = {
  phone: string;
  code: string;
};
export type AuthVerificationResponse = undefined;

export type AuthByTokenRequestParams = FormData;
export type AuthByTokenResponse = AuthResponse;
//#endregion

//#region HOME
export type Banner = {
  id: number;
  image: string;
};

export type HomeScreenProductsData = {
  [K in ProductListContentType]: ProductPreview[];
};

export type HomeScreenSection = {
  id: number;
  name: string;
  subSections: CatalogSection[]; //{id: number, name: string, isMaxDepth: boolean}
};
export type HomeScreenSectionsData = HomeScreenSection[];

export type HomeScreenData = {
  banners: Banner[]; //{id: number, image: string}
  sections: HomeScreenSectionsData;
  products?: HomeScreenProductsData;
};

export type GetMainPageRequestParams = undefined;
export type GetMainPageResponse = HomeScreenData;
//#endregion

//#region SECTION LIST
export type CatalogSection = {
  id: number;
  name: string;
  isMaxDepth: boolean;
};

export type SectionListRequestParams = {
  id?: number;
  storeCode?: string;
};
export type SectionListResponse = CatalogSection[];
//#endregion

//#region PRODUCT LIST
export type ProductPreview = {
  id: number;
  name: string;
  photo: string;
  prescription: boolean;
  info: {
    country: string;
    manufacturer: string;
  };
  store: {
    amount: number;
    availability: number;
  };
  price: {
    actual: number;
    old?: number;
    discount?: number;
  };
};

export type GetProductListRequestParams = {
  page?: number;
  sort?: string;
  filter?: FilterResult;
  defaultStoreId?: number;
};
export type GetProductListResponse = {
  list: ProductPreview[];

  page: number;
  isLastPage: boolean;
  sortList: {
    name: string;
    values: SortOption[];
    active: string; //
  };
};

export type ProdudctListRefObject = {
  scrollToTop: () => void;
};
//#endregion

//#region SEARCH
export type StoredSearchHistory = Dictionary<string>;
//#endregion

//#region SORTING
export type SortOption = {
  id: string;
  name: string;
};
//#endregion

//#region FILTER
export type FilterResult = Dictionary<
  FilterActiveOptions | {[K in 'min' | 'max']: number}
>;

export type FilterSingleActiveOptions = string | number;
export type FilterMultipleActiveOptions = FilterSingleActiveOptions[];
export type FilterActiveOptions =
  | FilterMultipleActiveOptions
  | FilterSingleActiveOptions;

export type FilterOption = {
  id: string | number;
  name: string;
  available: boolean;
};

export type Filter = {
  id: string;
  values:
    | FilterOption[]
    | {
        min: number;
        max: number;
      };
  name: string;
  active?: FilterActiveOptions;
};

export type FilterSection = {
  name?: string;
  children: Filter[];
};

export type GetFilterRequestParams = {
  filter?: FilterResult;
};
export type GetFilterResponse = Filter[];
//#endregion

//#region PRODUCT_DETAIL
type AvailableStore = {
  address: string;
  amount: number;
};
export type ProductDetailProp = {
  title: string;
  text: string;
  expanded?: boolean;
};
export type ProductDetail = {
  id: number;
  name: string;
  photo: string;
  prescription?: boolean;
  info: {
    activeSubstance?: string;
    props: ProductDetailProp[];
    manufacturer: string;
    country: string;
  };
  price: {
    actual: number;
    old?: number;
    discount?: number;
  };
  store: {
    amount: number;
    availability: number;
    storesList: AvailableStore[];
  };
  analog?: ProductPreview[];
};

export type ProductDetailRequestParams = {
  id: number;
  // storeCode?: string;
};
export type ProductDetailResponse = ProductDetail;
// //#endregion

// //#region SEARCH
// export type SearchTipContentType = 'tips' | 'tops' | 'history';
// export type SearchTipDataSource = {[K in SearchTipContentType]?: string[]};

// export type GetSearchTopRequestParams = {
//   query?: string;
// };
// export type GetSearchTopResponse = {
//   tips?: string[];
//   tops?: string[];
// };

export type GetSearchResultRequestParams = {
  query: string;
};
export type GetSearchResultResponse = number[];
//#endregion

//#region FAVORITE
export type FavoriteData = number[];

export type GetFavoriteProductListRequestParams = {id: FavoriteData};
export type GetFavoriteProductListResponse = ProductPreview[];
//#endregion

//#region DEFAULT STORE
export type DefaultStore = {
  id: number;
  address: string;
};

export type DefaultStoreData = DefaultStore | undefined;
//#endregion

//#region CART
export type CartProduct = Omit<ProductPreview, 'price'> & {
  price?: {
    actual: number;
    old?: number;
  };
  quantity: number;
};
export type GetCartRequestParams = {cart: Dictionary<number, number>};
export type GetCartResponse = {
  cart: CartProduct[];
  total?: number;
};
//#endregion

//#region CHECKOUT
//#region PICKPOINT
export type PickpointProductListItem = {
  id: number;
  name: string;
  price: number;
  quantity: number; //выбранное кол-во
  available: number; //доступно в текущей аптеке
  totalAvailable: number; //доступно на складе
};

export type PickPointListBlockType =
  | 'favoritePharm'
  | 'fullAvailable'
  | 'partAvailable'
  | 'notAvailable';

export type PickPoint = StoreCommonProps & {
  sort: number;
  blockType: PickPointListBlockType;
  productCount: number;
  productList: PickpointProductListItem[];
  timeUntilClosing?: number;
};

export type PickPointSectionListDate = 'today' | 'tomorrow';

export type PickPointSectionListItem = {
  title: string;
  data: PickPoint[];
};
export type PickPointSection = SectionListData<
  PickPoint,
  PickPointSectionListItem
>;
export type PickPointSectionListDataSource = {
  [K in PickPointSectionListDate]: PickPointSection[];
};

export type OnProceedToCheckoutButtonPressFn = (
  item: PickPoint,
  date: PickPointSectionListDate,
) => void;

export type PickpointRequestParams = {
  cart: StoredCartData;
};
export type PickpointResponse = PickPoint[];
//#endregion

//#region VERIFICATION
export type PhoneVerificationResolver = (isSuccessful: boolean) => void;
export type PhoneVerificationRejecter = (reason: RejectReason) => void;

export type PhoneVerificationModalRefObject = {
  isVisible: boolean;
  requestVerification: (phone: string) => Promise<any>;
  dismiss: () => void;
};
//#endregion

export type CheckoutFormData = {
  promocode: string;
} & UserPersonalData;

export type PromocodeResult = {
  applied: boolean;
  message: string;
};

export type CheckoutSummaryItem = {
  name: string;
  value: number;
  sign?: string;
  isTotal?: boolean;
};
export type CheckoutSummary = CheckoutSummaryItem[];

export type PaymentOption = {
  id: number;
  name: string;
};

export type CheckoutPickPoint = {
  id: number;
  address: string;
};
export type GetCalculatedOrderDataRequestParams = {
  cart: StoredCartData;
  deliveryId: number;
  deliveryDay: PickPointSectionListDate;
  promocode?: string;
};

export type GetCalculatedOrderDataResponse = {
  recipient: UserPersonalData;
  deliveryDay: string;
  pickPointData: CheckoutPickPoint;
  paymentList: PaymentOption[];
  total: CheckoutSummary;
  promocode?: PromocodeResult;
};

export type CreateOrderRequestParams = {
  cart: StoredCartData;
  recipient: UserPersonalData;
  deliveryId: number;
  deliveryDay: PickPointSectionListDate;
  paymentId: number;
  promocode?: string;
};

export type CreateOrderResponse = {
  id: number;
  address: string;
  photo: string;
  status: string;
  info: string;
  total: CheckoutSummary;
};
//#endregion

//#region ORDER

/**
 * [A] => Выполнен
 * [P] => Собирается
 * [D] => Отменен
 */
export type OrderStatusCode = 'D' | 'A' | 'P';

export type OrderPreview = {
  id: number;
  date: number;

  code: OrderStatusCode;
  status: string;

  price: number;
};

export type GetOrderListRequestParams = undefined;
export type GetOrderListResponse = OrderPreview[];

export interface OrderProduct extends ProductPreview {
  quantity: number;
}

export type OrderData = {
  id: number;
  date: number;

  isCancelable: boolean;

  code: OrderStatusCode;
  status: string;

  products: OrderProduct[];
  store?: Store;

  totalPrice: OrderTotalPrice;
};

export type OrderTotalPriceItem = CheckoutSummaryItem;
export type OrderTotalPrice = OrderTotalPriceItem[];

export type GetOrderDetailRequestParams = {
  id: number;
};
export type GetOrderDetailResponse = OrderData;

export type OrderCancelRequestParams = {id: number};
export type OrderCancelResponse = undefined;
//#endregion

//#region STORE
export type StoreCommonProps = {
  id: number;
  city: string;
  address: string;
  map: {
    lat: string;
    lon: string;
  };
};
export type StoreListItemSpecificProps = {
  photo: string;
  phone: string;
  time: string;
};
export type Store = StoreCommonProps & StoreListItemSpecificProps;

export type StoresSectionList = {
  title: string;
  data: Store[];
};

export type GetPharmacyListRequestParams = {filter: {id: number[]}} | undefined;
export type GetPharmacyListResponse = Store[];

export type PharmacySelectItem = {
  id: number;
  name: string;
};
//#endregion

//#region IMAGES
export type ImageSource = {
  uri: string;
  name: string;
  type: string;
};
//#endregion

//#region LOCATION
export type Location = {
  latitude: number;
  longitude: number;
};
//#endregion

//#region REVIEW
export type ReviewFormFields = {
  fio: string;
  email: string;
  message: string;
};

export type ReviewAdditionalFields = {
  rating: number;
  pharmacy?: number;
};
export type ReviewImageFields = {images: ImageSource[]};

export type ReviewFormData = ReviewFormFields &
  ReviewAdditionalFields &
  ReviewImageFields;

export type ReviewAddRequestParams = FormData;
export type ReviewAddResponse = undefined;
//#endregion

//#region MAP MODAL
export type MapModalState = 'full' | 'short' | 'close';

export type ModalSnaps = {[K in MapModalState]?: number};
//#endregion
