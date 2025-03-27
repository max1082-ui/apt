import React, {
  forwardRef,
  useState,
  useCallback,
  useImperativeHandle,
} from 'react';

import type {ForwardRefRenderFunction} from 'react';

import type {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';

import {SearchInput} from '@components/atoms';

import type {ProductListHeaderSearchRefObject} from '@types';

interface ProductListHeaderSearchProps {
  onSearchInit: (query: string) => void;
  editable?: boolean;
  initialValue?: string;
}

const ProductListHeaderSearch: ForwardRefRenderFunction<
  ProductListHeaderSearchRefObject,
  ProductListHeaderSearchProps
> = ({onSearchInit, initialValue = '', editable = true}, ref) => {
  const [query, setQuery] = useState<string>(initialValue);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const onChangeSearchInput = useCallback((text: string) => setQuery(text), []);
  const onResetSearchInput = useCallback(() => {
    onSearchInit('');
    setQuery('');
  }, [onSearchInit]);

  const onFocusSearchInput = useCallback(() => setIsSearchFocused(true), []);
  const onBlurSearchInput = useCallback(() => setIsSearchFocused(false), []);

  const onSubmitEditing = useCallback<
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void
  >(
    ({nativeEvent: {text}}) => {
      onSearchInit(text);
    },
    [onSearchInit],
  );

  useImperativeHandle(
    ref,
    () => ({
      query,
      reset: onResetSearchInput,
    }),
    [query, onResetSearchInput],
  );

  return (
    <SearchInput
      editable={editable}
      value={query}
      placeholder="Поиск лекарств и товаров"
      active={isSearchFocused}
      onBlur={onBlurSearchInput}
      onFocus={onFocusSearchInput}
      onChangeText={onChangeSearchInput}
      onSubmitEditing={onSubmitEditing}
      onResetButtonPress={onResetSearchInput}
    />
  );
};

export default forwardRef(ProductListHeaderSearch);
