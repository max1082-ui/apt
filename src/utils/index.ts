import {Linking} from 'react-native';

import {showMessage as showRnFlashMessage} from 'react-native-flash-message';

import GetLocation from 'react-native-get-location';

import Animated, {
  set,
  cond,
  block,
  timing,
  stopClock,
  startClock,
  clockRunning,
  Value,
  EasingNode,
} from 'react-native-reanimated';

import {Colors} from '@styles/colors';
import {AppTextStyles} from '@styles/typography';

import type {Dictionary} from '@types';
import type {AppSnackBarDurationConfig, AppSnackShowFn} from './types';
import {Location} from '@types';

//#region HELPERS
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export function stall(time = 3000): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, time));
}
//#endregion

//#region ANIMATION HELPERS
export function runTiming({
  clock,
  value,
  dest,
  duration = 250,
  easing = EasingNode.out(EasingNode.ease),
}: {
  clock: Animated.Clock;
  value: Animated.Value<number>;
  dest: Animated.Value<number>;
  duration?: number;
  easing?: Animated.EasingNodeFunction;
}) {
  const state = {
    finished: new Value(0),
    position: value,
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration,
    toValue: dest,
    easing,
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]), //if clock not running - reset state and start clock
    timing(clock, state, config), //timing itself
    cond(state.finished, stopClock(clock)), //stop clock if finished

    state.position, //returns
  ]);
}
//#endregion

//#region WHATSAPP LINK
export const openWhatsappLink = async () => {
  const WHATSAPP_URL = 'https://wa.me/79622200933';
  await Linking.openURL(WHATSAPP_URL);
};
//#endregion

//#region DATETIME
/**
 * Отдает время по-русски
 * @param {Date | number} d Date or unix timestamp in seconds
 * @returns {string} locale date string
 */
export const getLocalDateString = (d: number | Date): string => {
  const date = typeof d === 'number' ? new Date(d * 1000) : d;
  return date
    .toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year:
        new Date().getFullYear() === date.getFullYear() ? undefined : 'numeric',
    })
    .toUpperCase();
};

export const JS_TIMESTAMP_HOUR = 3600000;
/**
 * Возвращает JS таймстамп
 * @param {number} t unix timestamp in seconds
 * @returns {number} js timestamp in miliseconds
 */
export const toJsTimestamp = (t: number): number => t * 1000;

/**
 * @param {Date | number} d Date or unix timestamp
 * @returns locale date string
 */
export const getFormatDate = (d: number | Date): string => {
  const date = typeof d === 'number' ? new Date(d) : d;

  const formatDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const formatMounth =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

  const dateStringNumberFormat = `${formatDay}.${formatMounth}.${date.getFullYear()}`;

  return dateStringNumberFormat;
};

/**
 * getTimeLeft
 * @param {number} future - timestamp to (default to 1 day from past)
 * @returns {object} time in days, hours, minutes, seconds left from now to future
 */
const getTimeLeft = (
  future: number,
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const now = Date.now();

  if (future < now) {
    return {days: 0, hours: 0, minutes: 0, seconds: 0};
  }

  let delta = (future - now) / 1000;

  const days = Math.floor(delta / 86400);
  delta -= days * 86400;

  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  const seconds = delta % 60;

  return {days, hours, minutes, seconds};
};
//#endregion

//#region EQFN
/**
 * Угадывает объект ли это
 * @param {any} object нечто доподлинно неизвестно что
 * @returns boolean
 */
export function isObject(object: any): boolean {
  return object != null && typeof object === 'object';
}

/**
 * Сравнение объектов по ключам
 * @param {object} object1 объект 1
 * @param {object} object2 объект 2
 * @returns boolean
 */
export function shallowEqual<T extends Dictionary<any>>(
  object1: T,
  object2: T,
): boolean {
  const k1 = Object.keys(object1);
  const k2 = Object.keys(object2);
  if (k1.length === k2.length) {
    return false;
  }
  if (k1.join('') !== k2.join('')) {
    return false;
  }
  return true;
}

/**
 * Сравнение объектов с учетом свойств
 * @param {object} object1 объект 1
 * @param {object} object2 объект 2
 * @returns boolean
 */
export function deepEqual<T extends Dictionary<any> | undefined>(
  object1: T,
  object2: T,
): boolean {
  if (!object1 || !object2 || !isObject(object1) || !isObject(object2)) {
    return object1 === object2;
  }

  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}
//#endregion

//#region STRINGS
const phoneStringExcesses = new Set(['(', ')', '-', '+']);
/**
 * Возвращает номер телефона с вырезанными спецсимволами
 * @param {string} phone строка в формате номера телефона
 * @returns {string}
 */
export const getRawPhone = (phone: string): string =>
  phone
    .split('')
    .reduce(
      (str, char) => str + (phoneStringExcesses.has(char) ? '' : char),
      '',
    );

/**
 * Возвращает строковое представление цены с отделением разрядов пробелами
 * @param {number} price - цена
 * @returns {string} - строковое представление с пробелами
 */
export const getPriceWithSpaces = (price: number | string): string =>
  price
    .toString()
    .split(/(?=(?:\d{3})+$)/)
    .join(' ');

/**
 * Возвращает строковое представление цены с значимыми разрядами
 * @param {number} price - цена
 * @returns {string} - строковое представление с пробелами
 */
export const getPriceWithValuableDecimals = (price: number): string =>
  price % 1 > 0
    ? price
        .toFixed(2)
        .split('.')
        .map((part, index) => (index === 0 ? getPriceWithSpaces(part) : part))
        .join(',')
    : getPriceWithSpaces(price);

/**
 * Возвращает сущ-е в нужном склонении
 * @param {number} number - число
 * @param {string} one - сущ в единственном числе
 * @param {string} two - сущ в множественном числе (2x)
 * @param {string} five - сущ в множественном числе (5х)
 * @returns string
 */
export const getNoun = (
  number: number,
  one: string,
  two: string,
  five: string,
): string => {
  number = Math.abs(number);
  number %= 100;
  if (number >= 5 && number <= 20) {
    return five;
  }
  number %= 10;
  if (number === 1) {
    return one;
  }
  if (number >= 2 && number <= 4) {
    return two;
  }
  return five;
};

/**
 * Возвращает начальный и конечный индексы вхождения подстроки в строку в виде массива из двух чисел
 * @param {string} str - строка
 * @param {string} substr - подстрока
 * @returns number[]
 */
export function getSubstrPositions(str: string, substr: string): number[] {
  const lstr = str.toLowerCase();
  const lsubstr = substr.toLowerCase();
  const startPos = lstr.indexOf(lsubstr) || 0;
  const endPos = startPos + substr.length;
  return [startPos, endPos];
}
//#endregion

//#region FORM HELPERS
export const validator = {
  phone: ({
    value,
    errorMessage = '',
  }: {
    value: string;
    errorMessage?: string;
  }) => {
    let re = new RegExp(/^\+?[78](?:[-()]*\d){10}$/);
    let res = re.test(value);
    if (!res) {
      throw new Error(errorMessage || 'Некорректный номер телефона');
    }
  },
};
//#endregion

//#region ORDER
export const NOT_PAID_ORDER_LIFE_MS = 86400000;
export const getOrderAutoCancelWarningText = (
  orderCreateTime: number,
): string => {
  const timeLeft = getTimeLeft(orderCreateTime * 1000 + NOT_PAID_ORDER_LIFE_MS);
  const timeText =
    timeLeft.days > 0
      ? `${timeLeft.days}\u00A0${getNoun(timeLeft.days, 'день', 'дня', 'дней')}`
      : timeLeft.hours > 0
      ? `${timeLeft.hours}\u00A0${getNoun(
          timeLeft.hours,
          'час',
          'часа',
          'часов',
        )}`
      : timeLeft.minutes > 0
      ? `${timeLeft.minutes}\u00A0${getNoun(
          timeLeft.minutes,
          'минуту',
          'минуты',
          'минут',
        )}`
      : '';

  return `Неоплаченный заказ будет отменен через\u00A0${timeText}`;
};
//#endregion

//#region SNACK
export const APP_SNACK_DURATION: AppSnackBarDurationConfig = {
  short: 1500,
  long: 5000,
};

export const showSnack: AppSnackShowFn = ({
  duration = 'short',
  icon = 'auto',
  ...passThroughOptions
}) => {
  showRnFlashMessage({
    icon,
    floating: true,
    duration: APP_SNACK_DURATION[duration],
    textStyle: AppTextStyles.small,
    color: Colors.white,
    ...passThroughOptions,
  });
};
//#endregion

//#region DEV_HELPERS
export const getChaosBoolean = () => Math.random() > 0.5;
//#endregion

//#region LOCATION
export const getCurrentLocation = async (): Promise<Location | void> => {
  let coordinates: Location;
  try {
    coordinates = await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 20000,
    });
  } catch {
    return;
  }
  return coordinates;
};

export const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d.toFixed(1);
};

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
//#endregion

//#region COMPARE VERSIONS
export type CompareVersionsResult = 'satisfy' | 'missmatch';
export type CompareVersionsFn = (
  current: string,
  required: string,
) => CompareVersionsResult;

export const compareVersions: CompareVersionsFn = (current, required) => {
  const c = current.split('.').map((n) => parseInt(n, 10));
  const r = required.split('.').map((n) => parseInt(n, 10));

  if (c.length !== r.length) {
    // throw new Error('Version codes constraint missmatch');
    return 'satisfy'; //ситуация когда менеджер накосячит в файрбейсе с форматом версии, не нужно обрабатывать и ломать приложение удаленно - пускай работает предыдущая версия
  }

  let result: CompareVersionsResult = 'satisfy';

  for (let i = 0; i < c.length; i++) {
    if (c[i] === r[i]) {
      continue;
    }
    if (c[i] > r[i]) {
      break;
    }
    if (c[i] < r[i]) {
      result = 'missmatch';
      break;
    }
  }

  return result;
};
//#endregion
