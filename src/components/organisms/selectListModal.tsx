import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import type {ForwardRefRenderFunction} from 'react';

import RNModal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useHeaderHeight} from '@react-navigation/stack';

import {
  AppText,
  PressableOpacity,
  SearchInput,
  SelectableOption,
} from '@components/atoms';

import type {
  BaseOptionItem,
  SelectableOptionType,
} from '@components/atoms/types';

import {useArraySearch} from '@hooks';

import {
  SIZE_8,
  SIZE_16,
  SIZE_24,
  SIZE_32,
  WINDOW_GUTTER,
  WINDOW_HEIGHT,
} from '@styles/sizes';
import {Colors} from '@styles/colors';

import type {SelectListModalRefObject} from '@types';

interface SelectListModalProps {
  dataSource: BaseOptionItem[];
  withSearch?: boolean;
  activeOptions?: (string | number)[]; //ids
  selectOptionType?: SelectableOptionType;
  onSelect?: (item: BaseOptionItem) => void;
}

const SelectListModal: ForwardRefRenderFunction<
  SelectListModalRefObject,
  SelectListModalProps
> = (
  {
    dataSource,
    onSelect,
    withSearch = false,
    activeOptions = [],
    selectOptionType = 'checkbox',
  },
  ref,
) => {
  //#region MEASURES
  const headerHeight = useHeaderHeight();
  const {bottom: bottomSafeAreaInset} = useSafeAreaInsets();
  //#endregion

  //#region MODAL CONTROLS
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);

  const show = useCallback(() => setModalIsVisible(true), []);
  const dismiss = useCallback(() => setModalIsVisible(false), []);
  //#endregion

  //#region SEARCH
  const {searchResult, setQuery} = useArraySearch({
    arr: dataSource,
    searchValueExtractor: ({name}) => name,
  });

  const [internalQuery, setInternalQuery] = useState('');
  const timerRef = useRef<any>();
  const killTimer = useCallback(
    () => timerRef.current && clearTimeout(timerRef.current),
    [],
  );
  useEffect(() => {
    killTimer();
    timerRef.current = setTimeout(() => {
      setQuery(internalQuery);
    }, 300);
    return killTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalQuery]);
  //#endregion

  //#region BINDING
  const onChangeSearchInput = useCallback((text) => {
    setInternalQuery(text);
  }, []);
  const onSearchInputResetButtonPress = useCallback(() => {
    setInternalQuery('');
  }, []);

  const handleOnSelect = useCallback(
    (item: BaseOptionItem) => {
      onSelect && onSelect(item);
      // setTimeout(dismiss, 300); //пока оставлю здесь
    },
    [onSelect],
  );
  //#endregion

  //#region IMPERIUM
  useImperativeHandle(
    ref,
    () => ({
      show,
      dismiss,
    }),
    [show, dismiss],
  );
  //#endregion
  return (
    <RNModal
      isVisible={modalIsVisible}
      hasBackdrop={true}
      useNativeDriverForBackdrop={true}
      onBackdropPress={dismiss}
      style={styles.modalContainer}>
      <View
        style={[
          styles.modal,
          {
            height: WINDOW_HEIGHT - headerHeight,
          },
        ]}>
        {withSearch && (
          <View style={styles.searchInputContainer}>
            <SearchInput
              //TODO isActive
              value={internalQuery}
              onChangeText={onChangeSearchInput}
              onResetButtonPress={onSearchInputResetButtonPress}
              placeholder="Введите адрес аптеки"
              wrapperStyle={styles.inputWrapper}
            />
            <PressableOpacity
              onPress={dismiss}
              style={styles.closeButtonWrapper}>
              <AppText color={Colors.accent.default}>{'Готово'}</AppText>
            </PressableOpacity>
          </View>
        )}
        <FlatList
          data={searchResult}
          renderItem={({item}) => (
            <SelectableOption
              type={selectOptionType}
              item={item}
              isActive={activeOptions.includes(item.id)}
              onPress={() => handleOnSelect(item)}
            />
          )}
          keyExtractor={({id}) => id.toString()}
          initialNumToRender={dataSource.length}
          ListEmptyComponent={
            <AppText color={Colors.gray6}>{'Ничего не найдено'}</AppText>
          }
          contentContainerStyle={[
            styles.listContentContainer,
            {paddingBottom: bottomSafeAreaInset + SIZE_24},
          ]}
        />
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modal: {
    width: '100%',
    paddingTop: SIZE_32,
    backgroundColor: Colors.white,
    borderTopLeftRadius: SIZE_16,
    borderTopRightRadius: SIZE_16,
  },
  listContentContainer: {
    paddingVertical: SIZE_8,
    paddingHorizontal: WINDOW_GUTTER,
  },
  searchInputContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingHorizontal: WINDOW_GUTTER,
    marginBottom: SIZE_8,
  },
  closeButtonWrapper: {
    justifyContent: 'center',
    marginLeft: SIZE_8,
  },
  inputWrapper: {
    flex: 1,
  },
});

export default forwardRef(SelectListModal);
