import { useState } from 'react';
import useSWR from 'swr';
import get from 'lodash/get';
import { request } from 'graphql-request';
import TokenGrid from './TokenGrid';
import LoadingButton from '@mui/lab/LoadingButton';
import laggy from '../libs/swr-laggy-middleware';
import { useSearchParams } from 'react-router-dom';
import { TEZTOK_API } from '../consts';

function LazyLoadTokenGrid({
  query,
  namespace,
  headline,
  variables = {},
  swrParams = [],
  itemsPerLoad = 24,
  resultsPath = 'tokens',
  tokenPath = '',
  keyPath = 'token_id',
  refreshInterval = false,
  emptyMessage = 'No pixels!',
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [limit, setLimit] = useState(searchParams.get(namespace) ? parseInt(searchParams.get(namespace), 10) : itemsPerLoad);
  const { data, error, isValidating } = useSWR(
    [namespace, limit, ...swrParams],
    (ns, limit) => request(TEZTOK_API, query, { ...variables, limit }),
    {
      refreshInterval,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      use: [laggy],
    }
  );

  if (error) {
    return (
      <div className="LazyTokenGrid LazyTokenGrid--Error">
        <h2>{headline}</h2>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="LazyTokenGrid LazyTokenGrid--Loading">
        <h2>{headline}</h2>
        <span>LOADING...</span>
      </div>
    );
  }

  const tokens = get(data, resultsPath).map((result) => ({ ...(tokenPath ? get(result, tokenPath) : result), key: get(result, keyPath) }));
  const hasProbablyMore = tokens.length === limit;

  if (!tokens.length) {
    return (
      <div className="LazyTokenGrid LazyTokenGrid--NoResults">
        <h2>{headline}</h2>
        <span>{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div className="LazyTokenGrid">
      <h2>{headline}</h2>
      <TokenGrid tokens={tokens} />
      {hasProbablyMore && (
        <div className="LazyTokenGrid__More">
          <LoadingButton
            className="LoadMoreButton"
            loading={isValidating}
            onClick={() => {
              const newLimit = limit + itemsPerLoad;
              setLimit(newLimit);
              setSearchParams({ [namespace]: newLimit });
            }}
          >
            MORE PIXELS
          </LoadingButton>
        </div>
      )}
    </div>
  );
}

export default LazyLoadTokenGrid;
