import React, {FC, Fragment, useState, useEffect, useCallback} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';

import type {SearchMainScreenProps} from '@navigation/types';

import {
  AppText,
  SearchInput,
  SeparatorLine,
  RequestUpdateIndicator,
} from '@components/atoms';

import {
  getStoredSearchHistory,
  setStoredSearchHistory,
} from '@services/storage';
import ApiService from '@services/api';
import {DEFAULT_SORT_ID} from '@services/sort';
import {DEFAULT_API_ERROR_TEXT} from '@services/error';

import {useMount} from '@hooks';

import {Colors} from '@styles/colors';
import {Fonts} from '@styles/typography';
import {CommonStyles} from '@styles/common';
import {scaleFont, scale} from '@styles/mixins';
import {SIZE_8, SIZE_16, SIZE_24, SIZE_32, WINDOW_GUTTER} from '@styles/sizes';

import type {
  StoredSearchHistory,
  GetSearchResultResponse,
  GetSearchResultRequestParams,
} from '@types';
import {showSnack} from '@utils';

//TODO check when b-end ready
export type SearchTipContentType = 'tips' | 'tops' | 'history';
export type SearchTipDataSource = {[K in SearchTipContentType]?: string[]};
//---------------------------

const SearchMainScreen: FC<SearchMainScreenProps> = ({navigation}) => {
  //#region SEARCH
  const [query, setQuery] = useState<string>('');
  const [isNothingFound, setIsNothingFound] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(true);
  const [isSearchProcessing, setIsSearchProcessing] = useState<boolean>(false);

  const onChangeSearchInput = useCallback((text: string) => setQuery(text), []);
  const onFocusSearchInput = useCallback(() => setIsSearchFocused(true), []);
  const onBlurSearchInput = useCallback(() => setIsSearchFocused(false), []);
  const onResetSearchInput = useCallback(() => setQuery(''), []);

  useEffect(() => {
    setIsNothingFound(false);
  }, [query]);

  const onSearchInit = useCallback(
    async (passedQuery: string) => {
      if (passedQuery) {
        try {
          setIsSearchProcessing(true);

          const ApiRequest = new ApiService<
            GetSearchResultRequestParams,
            GetSearchResultResponse
          >('GET', 'catalog/search', {query: encodeURI(passedQuery)});
          const response = await ApiRequest.call();

          if (response && response.length > 0) {
            setIsNothingFound(false);
            await addSearchHistoryQuery(passedQuery);
            setIsSearchProcessing(false);
            navigation.push('ProductList', {
              title: passedQuery,
              sortId: DEFAULT_SORT_ID,
              filter: {id: response},
              excludeFilters: ['id'],
              initialSearchQuery: passedQuery,
            });
          } else {
            setIsNothingFound(true);
            setIsSearchProcessing(false);
          }
        } catch (err) {
          showSnack({
            type: 'danger',
            message: err.message || DEFAULT_API_ERROR_TEXT,
          });
          setIsSearchProcessing(false);
        }
      }
    },
    [navigation],
  );
  // #endregion

  // //#region DATA
  const [dataSource, setDataSource] = useState<SearchTipDataSource>();

  useMount(async () => {
    try {
      const storedHistory = await getStoredSearchHistory();
      if (storedHistory !== null) {
        setDataSource({history: Object.values(storedHistory)});
      }
    } catch (err) {
      return; //no need to handle
    }
  });
  //#endregion

  //#region SEARCH HISTORY
  const addSearchHistoryQuery = async (
    historyQuery: string,
  ): Promise<void | undefined> => {
    try {
      const storedHistory = await getStoredSearchHistory();
      let nextStoredHistory: StoredSearchHistory;
      if (storedHistory !== null) {
        if (Object.values(storedHistory).includes(historyQuery)) {
          return;
        }

        const historySize = Object.keys(storedHistory).length;
        if (historySize === 5) {
          nextStoredHistory = (({[0]: _, ...rest}) =>
            Object.fromEntries(
              new Map([
                ...Object.entries(Object.values(rest)),
                [(historySize - 1).toString(), historyQuery],
              ]),
            ))(storedHistory);
        } else if (historySize > 5) {
          nextStoredHistory = {0: historyQuery};
        } else {
          nextStoredHistory = {
            ...storedHistory,
            [historySize]: historyQuery,
          };
        }
      } else {
        nextStoredHistory = {0: historyQuery};
      }

      await setStoredSearchHistory(nextStoredHistory);

      setDataSource((current) => ({
        ...current,
        history: Object.values(nextStoredHistory),
      }));
    } catch (err) {
      return;
    }
  };
  //#endregion

  //#region BINDNIG
  const onTipPress = useCallback(
    async (tip: string): Promise<void> => {
      setQuery(tip);
      onSearchInit(tip);
    },
    [onSearchInit],
  );
  //#endregion

  // #region RENDER
  const renderListItem = useCallback(
    (item: string, key: string, onPress: () => void) => (
      <Fragment key={key}>
        <Pressable style={styles.listItem} onPress={onPress}>
          <AppText>{item}</AppText>
        </Pressable>
        <SeparatorLine />
      </Fragment>
    ),
    [],
  );

  const renderTops = useCallback(
    () => (
      <>
        {dataSource?.history && (
          <View style={styles.tipsSectionContainer}>
            <AppText
              type="bodyBold"
              color={Colors.gray7}
              wrapperStyle={styles.tipsSectionTitleWrapper}>
              {'Вы искали ранее'}
            </AppText>
            {dataSource.history.map((item, index) =>
              renderListItem(item, index.toString(), () => onTipPress(item)),
            )}
          </View>
        )}
      </>
    ),
    [dataSource?.history, onTipPress, renderListItem],
  );
  //#endregion

  return (
    <View style={CommonStyles.fill}>
      <View style={styles.searchInputContainer}>
        <SearchInput
          autoFocus={true}
          editable={!isSearchProcessing}
          value={query}
          placeholder="Поиск лекарств и товаров"
          active={isSearchFocused}
          onBlur={onBlurSearchInput}
          onFocus={onFocusSearchInput}
          onChangeText={onChangeSearchInput}
          onSubmitEditing={({nativeEvent: {text}}) => onSearchInit(text)}
          onResetButtonPress={onResetSearchInput}
        />
      </View>
      <View style={CommonStyles.fill}>
        <ScrollView
          keyboardDismissMode="interactive"
          style={styles.contentContainer}>
          {isNothingFound ? (
            <AppText
              type="bodyBold"
              color={Colors.gray7}
              align="center"
              wrapperStyle={styles.nothingFoundTextWrap}>
              {
                'К сожалению мы не смогли найти товар с таким названием или действующим веществом'
              }
            </AppText>
          ) : (
            renderTops()
          )}
        </ScrollView>
        {isSearchProcessing && <RequestUpdateIndicator />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInputContainer: {
    marginTop: SIZE_8,
    paddingHorizontal: WINDOW_GUTTER,
  },
  contentContainer: {
    paddingVertical: SIZE_32,
    paddingHorizontal: WINDOW_GUTTER,
  },
  nothingFoundTextWrap: {
    marginTop: scale(200),
  },
  tipsSectionContainer: {
    marginBottom: SIZE_32,
  },
  tipsSectionTitleWrapper: {
    marginBottom: SIZE_16,
  },
  contentHintText: {
    color: Colors.gray3,
  },
  listTitleText: {
    ...Fonts.semiBold,
    fontSize: scaleFont(16),
    lineHeight: scale(22),
    marginBottom: SIZE_8,
  },
  listItem: {
    height: SIZE_24,
    marginVertical: SIZE_8,
    justifyContent: 'center',
  },
});

export default SearchMainScreen;
