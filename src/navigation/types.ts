import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {
  RouteProp,
  NavigatorScreenParams,
  CompositeNavigationProp,
} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';

import type {
  Filter,
  SortOption,
  FilterResult,
  PickPointSectionListDate,
} from '@types';
// import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

//#region AUTH
type AuthSuccessNavigationAction = 'replace' | 'pop';
type AuthDismissButtonActionType = 'dismiss' | 'skip';

export type AuthStackParamList = {
  AuthWelcome: undefined;
  AuthSignIn: {
    dismissButtonActionType: AuthDismissButtonActionType;
    onSuccessNavigationActionType: AuthSuccessNavigationAction;
  };
  AuthVerification: {
    phone: string;
    onSuccessNavigationActionType: AuthSuccessNavigationAction;
  };
};

export type AuthWelcomeScreenProps = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<AuthStackParamList, 'AuthWelcome'>,
    StackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<AuthStackParamList, 'AuthWelcome'>;
};

export type AuthSignInScreenProps = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<AuthStackParamList, 'AuthSignIn'>,
    StackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<AuthStackParamList, 'AuthSignIn'>;
};

export type AuthVerificationScreenProps = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<AuthStackParamList, 'AuthVerification'>,
    StackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<AuthStackParamList, 'AuthVerification'>;
};
//#endregion

//#region STORES
export type StoresStackParamList = {
  StoresList: {
    selectDefaultStore?: boolean;
  };
};

export type StoresListScreenProps = {
  navigation: StackNavigationProp<StoresStackParamList, 'StoresList'>;
  route: RouteProp<StoresStackParamList, 'StoresList'>;
};
//#endregion

//#region TABS
//#region HOME
export type HomeStackParamList = {
  HomeMain: undefined;
  HomeBannerDetail: undefined; //TODO уточни у менеджера нужно ли это и запили норм тип если нужно / удали отовсюду если не нужно
} & NestedCatalogSectionListParamList &
  NestedProductListParamList;

export type HomeMainScreenProps = {
  navigation: CompositeNavigationProp<
    CompositeNavigationProp<
      StackNavigationProp<HomeStackParamList, 'HomeMain'>,
      StackNavigationProp<RootStackParamList>
    >,
    BottomTabNavigationProp<AppTabsParamList>
  >;
  route: RouteProp<HomeStackParamList, 'HomeMain'>;
};

export type HomeBannerDetailScreenProps = {
  navigation: StackNavigationProp<HomeStackParamList, 'HomeBannerDetail'>;
  route: RouteProp<HomeStackParamList, 'HomeBannerDetail'>;
};
//#endregion

//#region SEARCH
export type SearchStackParamList = {
  SearchMain:
    | undefined
    | {
        query: string;
      };
} & NestedProductListParamList;

export type SearchMainScreenProps = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<SearchStackParamList, 'SearchMain'>,
    StackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<SearchStackParamList, 'SearchMain'>;
};
//#endregion

//#region CART
export type CartStackParamList = {
  CartMain: undefined;
};
export type CartMainScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<AppTabsParamList, 'CartStack'>,
    CompositeNavigationProp<
      StackNavigationProp<CartStackParamList, 'CartMain'>,
      StackNavigationProp<RootStackParamList>
    >
  >;
  route: RouteProp<CartStackParamList, 'CartMain'>;
};
//#endregion

//#region FAVORITE
export type FavoriteStackParamList = {
  FavoriteMain: undefined;
};
export type FavoriteMainScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<AppTabsParamList, 'FavoriteStack'>,
    CompositeNavigationProp<
      StackNavigationProp<FavoriteStackParamList, 'FavoriteMain'>,
      StackNavigationProp<RootStackParamList>
    >
  >;
};
//#endregion

//#region PROFILE
export type ProfileStackParamList = {
  ProfileMain: undefined;
  ProfileFavoriteStores: undefined;
  ProfilePersonalData: undefined;
  ProfileOrderList: undefined;
  ProfileOrderDetail: {orderId: number};
  ProfileReviewAdd: undefined;
  ProfileHelp: undefined;
};

export type ProfileMainScreenProps = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<ProfileStackParamList, 'ProfileMain'>,
    StackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<ProfileStackParamList, 'ProfileMain'>;
};

export type ProfileFavoriteStoresScreenProps = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<ProfileStackParamList, 'ProfileFavoriteStores'>,
    StackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<ProfileStackParamList, 'ProfileFavoriteStores'>;
};

export type ProfilePersonalDataScreenProps = {
  navigation: StackNavigationProp<ProfileStackParamList, 'ProfilePersonalData'>;
  route: RouteProp<ProfileStackParamList, 'ProfilePersonalData'>;
};

export type ProfileOrderListScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<AppTabsParamList, 'ProfileStack'>,
    StackNavigationProp<ProfileStackParamList, 'ProfileOrderList'>
  >;
  route: RouteProp<ProfileStackParamList, 'ProfileOrderList'>;
};

export type ProfileOrderDetailScreenProps = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<ProfileStackParamList, 'ProfileOrderDetail'>,
    StackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<ProfileStackParamList, 'ProfileOrderDetail'>;
};

export type ProfileReviewAddScreenProps = {
  navigation: StackNavigationProp<ProfileStackParamList, 'ProfileReviewAdd'>;
  route: RouteProp<ProfileStackParamList, 'ProfileReviewAdd'>;
};
export type ProfileHelpScreenProps = {
  navigation: StackNavigationProp<ProfileStackParamList, 'ProfileHelp'>;
  route: RouteProp<ProfileStackParamList, 'ProfileHelp'>;
};
//#endregion

//#region NESTED
//#region CATALOG
export type NestedCatalogSectionListParamList = {
  CatalogSectionList: {
    title: string;
    sectionId?: number; //for subsection list
  };
};
export type NestedCatalogSectionListStackParamListUnion = HomeStackParamList;

export type CatalogSectionListScreenProps = {
  navigation: StackNavigationProp<
    NestedCatalogSectionListStackParamListUnion,
    'CatalogSectionList'
  >;
  route: RouteProp<
    NestedCatalogSectionListStackParamListUnion,
    'CatalogSectionList'
  >;
};
//#endregion

//#region PRODUCT
export type NestedProductListParamList = {
  ProductList: {
    title: string;

    sortId: string;

    filter: FilterResult;
    excludeFilters?: string[];

    initialSearchQuery?: string;
  };
};

export type NestedProductListStackParamListUnion =
  | HomeStackParamList
  | SearchStackParamList;

export type ProductListScreenProps = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<NestedProductListStackParamListUnion, 'ProductList'>,
    StackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<NestedProductListStackParamListUnion, 'ProductList'>;
};
//#endregion
//#endregion

export type AppTabsParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList> | undefined;
  SearchStack: NavigatorScreenParams<SearchStackParamList> | undefined;
  CartStack: NavigatorScreenParams<CartStackParamList> | undefined;
  FavoriteStack: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList> | undefined;
};
//#endregion

//#region PRODUCT
export type ProductStackParamList = {
  ProductDetail: {
    productId: number;
    productName: string;
  };
};
export type ProductDetailScreenProps = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<ProductStackParamList, 'ProductDetail'>,
    StackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<ProductStackParamList, 'ProductDetail'>;
};
//#endregion

//#region SORT
export type SortStackParamList = {
  SortMain: {
    setParamsKey: string;
    sortData: SortOption[];
    activeSortId?: string;
  };
};
export type SortMainScreenProps = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<SortStackParamList, 'SortMain'>,
    StackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<SortStackParamList, 'SortMain'>;
};
//#endregion

//#region FILTER
export type FilterStackParamList = {
  FilterMain: {
    filterData: Filter[];
    setParamsKey: string;
    filterResult?: FilterResult;
  };
  FilterOptions: {
    dataSource: Filter;
    setParamsKey: string;
    filterResult?: FilterResult;
  };
};
export type FilterMainScreenProps = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<FilterStackParamList, 'FilterMain'>,
    StackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<FilterStackParamList, 'FilterMain'>;
};

export type FilterOptionsScreenProps = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<FilterStackParamList, 'FilterOptions'>,
    StackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<FilterStackParamList, 'FilterOptions'>;
};
//#endregion

//#region CHECKOUT
export type CheckoutStackParamList = {
  CheckoutPickPointSelect: undefined;
  CheckoutConfirm: {
    deliveryId: number;
    deliveryDay: PickPointSectionListDate;
  };
  CheckoutFinal: {
    orderId: number;
    imageSource: string;
    descriptionData: {
      title: string;
      text: string;
    }[];
    warningText: string;
  };
};
export type CheckoutPickPointSelectScreenProps = {
  navigation: StackNavigationProp<
    CheckoutStackParamList,
    'CheckoutPickPointSelect'
  >;
  route: RouteProp<CheckoutStackParamList, 'CheckoutPickPointSelect'>;
};
export type CheckoutConfirmScreenProps = {
  navigation: StackNavigationProp<CheckoutStackParamList, 'CheckoutConfirm'>;
  route: RouteProp<CheckoutStackParamList, 'CheckoutConfirm'>;
};
export type CheckoutFinalScreenProps = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<CheckoutStackParamList, 'CheckoutFinal'>,
    StackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<CheckoutStackParamList, 'CheckoutFinal'>;
};
//#endregion

//#region ROOT
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList> | undefined;

  AppTabs: NavigatorScreenParams<AppTabsParamList> | undefined;

  StoresStack: NavigatorScreenParams<StoresStackParamList>;

  ProductStack: NavigatorScreenParams<ProductStackParamList>;

  SortStack: NavigatorScreenParams<SortStackParamList>;
  FilterStack: NavigatorScreenParams<FilterStackParamList>;

  CheckoutStack: NavigatorScreenParams<CheckoutStackParamList>;

  PolicyScreen: undefined;
};

export type PolicyScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'PolicyScreen'>;
  route: RouteProp<RootStackParamList, 'PolicyScreen'>;
};
//#endregion

// //#region ROOT
// //#region CHECKOUT FINAL
// export type CheckoutFinalScreenProps = {
//   navigation: StackNavigationProp<RootStackParamList>;
//   route: RouteProp<RootStackParamList, 'CheckoutFinal'>;
// };
// //#endregion
// //#endregion

// //#region LOCATION
// export type LocationStackParamList = {
//   LocationList: undefined;
// };

// export type LocationListScreenProps = {
//   navigation: CompositeNavigationProp<
//     StackNavigationProp<LocationStackParamList, 'LocationList'>,
//     StackNavigationProp<RootStackParamList>
//   >;
// };
// //#endregion

// //#region MEETING
// export type MeetingStackParamList = {
//   MeetingMain: undefined;
// };

// export type MeetingMainScreenProps = {
//   navigation: CompositeNavigationProp<
//     StackNavigationProp<RootStackParamList>,
//     StackNavigationProp<MeetingStackParamList, 'MeetingMain'>
//   >;
// };
// //#endregion

// //#region AUTH
// type AuthSuccessNavigationAction = 'replace' | 'pop';
// type AuthDismissButtonActionType = 'dismiss' | 'skip';

// export type AuthStackParamList = {
//   AuthSignIn: {
//     dismissButtonActionType: AuthDismissButtonActionType;
//     onSuccessNavigationActionType: AuthSuccessNavigationAction;
//   };
//   AuthVerification: {
//     phone: string;
//     onSuccessNavigationActionType: AuthSuccessNavigationAction;
//   };
// };

// export type AuthSignInScreenProps = {
//   navigation: CompositeNavigationProp<
//     StackNavigationProp<AuthStackParamList, 'AuthSignIn'>,
//     StackNavigationProp<RootStackParamList>
//   >;
//   route: RouteProp<AuthStackParamList, 'AuthSignIn'>;
// };

// export type AuthVerificationScreenProps = {
//   navigation: CompositeNavigationProp<
//     StackNavigationProp<AuthStackParamList, 'AuthVerification'>,
//     StackNavigationProp<RootStackParamList>
//   >;
//   route: RouteProp<AuthStackParamList, 'AuthVerification'>;
// };
// //#endregion

// //#region APP_TABS
// export type AppTabsParamList = {
//   HomeStack: undefined;
//   CatalogStack: NavigatorScreenParams<CatalogStackParamList> | undefined;
//   FavoriteStack: undefined;
//   CartStack: undefined;
//   ProfileStack: NavigatorScreenParams<ProfileStackParamList> | undefined;
// };

// //#region HOME
// export type HomeStackParamList = {
//   HomeMain: undefined;
//   BrandList: undefined;
//   BrandDetail: {
//     title: string;
//     brandId: number;
//   };
//   ProductList: {
//     title: string;
//     contentType?: ProductListContentType;
//     filter?: FilterResult;
//     sectionId?: number;
//     sortId?: string;
//     excludeFilters?: string[]; //array of filter section codes to exclude
//   };
//   ProductDetail: {
//     productId: number;
//     productName: string;
//   };
//   Search: undefined;
// };

// export type HomeMainScreenProps = {
//   navigation: StackNavigationProp<HomeStackParamList, 'HomeMain'>;
// };
// //#endregion

// //#region CATALOG
// export type CatalogStackParamList = {
//   CatalogMain: undefined;
//   CatalogSection: {
//     title: string;
//     sectionId: number;
//   };
//   BrandList: undefined;
//   BrandDetail: {
//     title: string;
//     brandId: number;
//   };
//   ProductList: {
//     title: string;
//     contentType?: ProductListContentType;
//     filter?: FilterResult;
//     sectionId?: number;
//     sortId?: string;
//     excludeFilters?: string[]; //array of filter section codes to exclude
//   };
//   ProductDetail: {
//     productId: number;
//     productName: string;
//   };
//   Search: undefined;
// };

// export type CatalogMainScreenProps = {
//   navigation: StackNavigationProp<CatalogStackParamList, 'CatalogMain'>;
// };
// export type CatalogSectionScreenProps = {
//   navigation: StackNavigationProp<CatalogStackParamList, 'CatalogSection'>;
//   route: RouteProp<CatalogStackParamList, 'CatalogSection'>;
// };
// //#endregion

// //#region SORT
// export type SortStackParamList = {
//   SortMain: {
//     setParamsKey: string;
//     sortData: SortOption[];
//     activeSortId?: string;
//   };
// };
// export type SortMainScreenProps = {
//   navigation: CompositeNavigationProp<
//     StackNavigationProp<SortStackParamList, 'SortMain'>,
//     StackNavigationProp<RootStackParamList>
//   >;
//   route: RouteProp<SortStackParamList, 'SortMain'>;
// };
// //#endregion

// //#region FILTER
// export type FilterStackParamList = {
//   FilterMain: {
//     filterData: FilterSection[];
//     setParamsKey: string;
//     sectionId?: number;
//     filterResult?: FilterResult;
//     contentType?: ProductListContentType;
//   };
//   FilterOptions: {
//     dataSource: Filter;
//     setParamsKey: string;
//     sectionId?: number;
//     filterResult?: FilterResult;
//     contentType?: ProductListContentType;
//     initialProductCount?: number;
//   };
// };
// export type FilterMainScreenProps = {
//   navigation: CompositeNavigationProp<
//     StackNavigationProp<FilterStackParamList, 'FilterMain'>,
//     StackNavigationProp<RootStackParamList>
//   >;
//   route: RouteProp<FilterStackParamList, 'FilterMain'>;
// };

// export type FilterOptionsScreenProps = {
//   navigation: CompositeNavigationProp<
//     StackNavigationProp<FilterStackParamList, 'FilterOptions'>,
//     StackNavigationProp<RootStackParamList>
//   >;
//   route: RouteProp<FilterStackParamList, 'FilterOptions'>;
// };

// //#endregion

// //#region FAVORITE
// export type FavoriteStackParamList = {
//   FavoriteMain: undefined;
//   ProductDetail: {
//     productId: number;
//     productName: string;
//   };
// };
// export type FavoriteMainScreenProps = {
//   navigation: CompositeNavigationProp<
//     BottomTabNavigationProp<AppTabsParamList, 'FavoriteStack'>,
//     StackNavigationProp<FavoriteStackParamList, 'FavoriteMain'>
//   >;
// };
// //#endregion

// //#region BRAND
// export type BrandListScreenProps = {
//   navigation: StackNavigationProp<
//     HomeStackParamList | CatalogStackParamList,
//     'BrandList'
//   >;
// };
// export type BrandDetailScreenProps = {
//   navigation: StackNavigationProp<
//     HomeStackParamList | CatalogStackParamList,
//     'BrandDetail'
//   >;
//   route: RouteProp<HomeStackParamList | CatalogStackParamList, 'BrandDetail'>;
// };
// //#endregion

// //#region PRODUCT
// export type ProductListScreenProps = {
//   navigation: CompositeNavigationProp<
//     StackNavigationProp<
//       HomeStackParamList | CatalogStackParamList,
//       'ProductList'
//     >,
//     StackNavigationProp<RootStackParamList, 'FilterStack'>
//   >;
//   route: RouteProp<HomeStackParamList | CatalogStackParamList, 'ProductList'>;
// };
// type ProductDetailScreenStack =
//   | HomeStackParamList
//   | CatalogStackParamList
//   | CartStackParamList
//   | FavoriteStackParamList
//   | ProfileStackParamList;

// export type ProductDetailScreenProps = {
//   navigation: StackNavigationProp<ProductDetailScreenStack, 'ProductDetail'>;
//   route: RouteProp<ProductDetailScreenStack, 'ProductDetail'>;
// };
// //#endregion

// //#region SEARCH
// export type SearchScreenProps = {
//   navigation: StackNavigationProp<
//     HomeStackParamList | CatalogStackParamList,
//     'Search'
//   >;
// };
// //#endregion

// //#region CART
// export type CartStackParamList = {
//   CartMain: undefined;

//   ProductDetail: {
//     productId: number;
//     productName: string;
//   };

//   CartCheckout: undefined;
//   CartCheckoutPersonalData: undefined;
//   CartCheckoutDeliveryOptions: undefined;
//   CartCheckoutDeliveryAddress: {delivery: SelectedDeliveryOptionBase};
//   CartCheckoutDeliveryPickPointList: {delivery: SelectedDeliveryOptionBase};
//   CartCheckoutCitySelect: undefined;
//   CartCheckoutPaymentOptions: undefined;
// };

// export type CartMainScreenProps = {
//   navigation: CompositeNavigationProp<
//     BottomTabNavigationProp<AppTabsParamList, 'CartStack'>,
//     CompositeNavigationProp<
//       StackNavigationProp<RootStackParamList>,
//       StackNavigationProp<CartStackParamList, 'CartMain'>
//     >
//   >;
// };
// //#region CHECKOUT
// export type CartCheckoutScreenProps = {
//   navigation: CompositeNavigationProp<
//     StackNavigationProp<CartStackParamList, 'CartCheckout'>,
//     StackNavigationProp<RootStackParamList>
//   >;
// };

// export type CartCheckoutPersonalDataScreenProps = {
//   navigation: StackNavigationProp<
//     CartStackParamList,
//     'CartCheckoutPersonalData'
//   >;
// };

// export type CartCheckoutDeliveryOptionsScreenProps = {
//   navigation: StackNavigationProp<
//     CartStackParamList,
//     'CartCheckoutDeliveryOptions'
//   >;
// };

// export type CartCheckoutDeliveryAddressScreenProps = {
//   navigation: StackNavigationProp<
//     CartStackParamList,
//     'CartCheckoutDeliveryAddress'
//   >;
//   route: RouteProp<CartStackParamList, 'CartCheckoutDeliveryAddress'>;
// };

// export type CartCheckoutDeliveryPickPointListScreenProps = {
//   navigation: StackNavigationProp<
//     CartStackParamList,
//     'CartCheckoutDeliveryPickPointList'
//   >;
//   route: RouteProp<CartStackParamList, 'CartCheckoutDeliveryPickPointList'>;
// };

// export type CartCheckoutCitySelectScreenProps = {
//   navigation: StackNavigationProp<CartStackParamList, 'CartCheckoutCitySelect'>;
// };

// export type CartCheckoutPaymentOptionsScreenProps = {
//   navigation: StackNavigationProp<
//     CartStackParamList,
//     'CartCheckoutPaymentOptions'
//   >;
// };
// //#endregion
// //#endregion

// //#region PROFILE
// export type ProfileStackParamList = {
//   ProfileMain: undefined;
//   PersonalData: {address?: IUserAddress};
//   PersonalDataAddress: {address: IUserAddress};
//   BonusProgram: undefined;
//   OrderList: undefined;
//   OrderDetail: {orderId: string};
//   ProductDetail: {productId: number; productName: string};
//   ReviewAdd: {shopId?: number};
//   ShopSelect: {dataSource: IShop[]; shopId: number};
// };

// export type ProfileMainScreenProps = {
//   navigation: CompositeNavigationProp<
//     StackNavigationProp<RootStackParamList>,
//     StackNavigationProp<ProfileStackParamList, 'ProfileMain'>
//   >;
// };
// export type PersonalDataScreenProps = {
//   navigation: StackNavigationProp<ProfileStackParamList, 'PersonalData'>;
//   route: RouteProp<ProfileStackParamList, 'PersonalData'>;
// };
// export type PersonalDataAddressScreenProps = {
//   navigation: StackNavigationProp<ProfileStackParamList, 'PersonalDataAddress'>;
//   route: RouteProp<ProfileStackParamList, 'PersonalDataAddress'>;
// };
// export type BonusProgramScreenProps = {
//   navigation: StackNavigationProp<ProfileStackParamList, 'BonusProgram'>;
// };
// export type OrderListScreenProps = {
//   navigation: CompositeNavigationProp<
//     BottomTabNavigationProp<AppTabsParamList, 'ProfileStack'>,
//     StackNavigationProp<ProfileStackParamList, 'OrderList'>
//   >;
// };
// export type OrderDetailScreenProps = {
//   navigation: StackNavigationProp<ProfileStackParamList, 'OrderDetail'>;
//   route: RouteProp<ProfileStackParamList, 'OrderDetail'>;
// };
// export type ReviewAddScreenProps = {
//   navigation: StackNavigationProp<ProfileStackParamList, 'ReviewAdd'>;
//   route: RouteProp<ProfileStackParamList, 'ReviewAdd'>;
// };
// export type ShopSelectScreenProps = {
//   navigation: StackNavigationProp<ProfileStackParamList, 'ShopSelect'>;
//   route: RouteProp<ProfileStackParamList, 'ShopSelect'>;
// };
// //#endregion

// //#endregion
