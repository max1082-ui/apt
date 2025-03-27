import React, {FC, useCallback} from 'react';
import {FlatList, StyleSheet} from 'react-native';

import type {CatalogSectionListScreenProps} from '@navigation/types';

import {Loader, TextLink} from '@components/atoms';

import {DEFAULT_SORT_ID} from '@services/sort';
import {FILTER_SECTION_ID_PROP_NAME} from '@services/filter';

import {useApiCall} from '@hooks';

import {SIZE_16, SIZE_24, WINDOW_GUTTER} from '@styles/sizes';

import type {
  CatalogSection,
  SectionListResponse,
  SectionListRequestParams,
} from '@types';

const CatalogSectionList: FC<CatalogSectionListScreenProps> = ({
  route: {
    params: {sectionId},
  },
  navigation,
}) => {
  //#region DATA
  const {data: dataSource, loadingState} = useApiCall<
    SectionListRequestParams,
    SectionListResponse
  >({
    method: 'GET',
    endpoint: 'catalog/section',
    requestParams: {id: sectionId},
    responseInterceptor: (sections) => {
      return sections.sort((s) => (s.isMaxDepth ? 1 : -1));
    },
  });
  //#endregion

  //#region BINDING
  const onSectionListItemPress = useCallback(
    ({id, isMaxDepth, name: title}: CatalogSection) => {
      if (isMaxDepth) {
        let filter = {[FILTER_SECTION_ID_PROP_NAME]: id};
        return navigation.push('ProductList', {
          title,
          filter,
          sortId: DEFAULT_SORT_ID,
          excludeFilters: Object.keys(filter),
        });
      } else {
        return navigation.push('CatalogSectionList', {
          title,
          sectionId: id,
        });
      }
    },
    [navigation],
  );
  //#endregion

  if (loadingState === 'loading') {
    return <Loader size="large" />;
  }

  return (
    <FlatList
      data={dataSource}
      keyExtractor={({id}) => id.toString()}
      initialNumToRender={15}
      renderItem={({item}) => (
        <TextLink
          label={item.name}
          showArrow={!item.isMaxDepth}
          wrapperStyle={styles.sectionWrapper}
          textType={'h3'}
          onPress={() => onSectionListItemPress(item)}
        />
      )}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: WINDOW_GUTTER,
    paddingVertical: SIZE_24,
  },
  sectionWrapper: {
    paddingVertical: SIZE_16,
  },
});

export default CatalogSectionList;
