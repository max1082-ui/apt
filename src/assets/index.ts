import FontelloConfig from './config.json';

const Images = {
  //#region TEMPORARY
  mapBanner: require('./images/map-banner.png'),
  storeSelect: require('./images/store-select.png'),
  //#endregion

  //#region MAP
  mapMarker: require('./images/map-marker.png'),
  //#endregion

  //#region EMPTY
  emptyCart: require('./images/empty-cart.png'),
  emptyFavorite: require('./images/empty-favorite.png'),
  emptyOrderList: require('./images/empty-orderList.png'),
  //#endregion

  //#region AUTH
  authBg: require('./images/auth-bg.png'),
  authGirl: require('./images/auth-girl.png'),
  welcomeGirl: require('./images/welcome-girl.png'),
  networkError: require('./images/network-error.png'),
  //#endregion
};

export {Images, FontelloConfig};
