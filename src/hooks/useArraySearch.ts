import {useState, useEffect, useMemo} from 'react';
import type {Dispatch, SetStateAction} from 'react';

type ArraySearchParams<T> = {
  arr: T[] | undefined;
  searchValueExtractor: (item: T) => string;
};

type ArraySearchResult<T> = {
  searchResult: T[];
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
};

/**
 * Get search result array of values by query
 *
 * @param {Array} arr initial array of values empty by default
 * @param {Function} getSearchValue value getter function (for array of strings use (str) => str;)
 *
 * @returns {Object}
 */
function useArraySearch<T>({
  arr = [],
  searchValueExtractor,
}: ArraySearchParams<T>): ArraySearchResult<T> {
  const [query, setQuery] = useState<string>('');
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [searchResult, setSearchResult] = useState<T[]>([]);

  useEffect(() => {
    setDataSource(arr);
  }, [arr]);

  useEffect(() => {
    if (query.length > 0) {
      let res =
        dataSource.length > 0
          ? dataSource.filter((item) =>
              searchValueExtractor(item)
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
          : dataSource;
      searchResult !== res && setSearchResult(res);
    } else {
      dataSource !== searchResult && setSearchResult(dataSource);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, dataSource]);

  return useMemo(
    () => ({
      searchResult,
      query,
      setQuery,
    }),
    [query, searchResult],
  );
}

export default useArraySearch;
