import useSWR from 'swr';
import uniqBy from 'lodash/uniqBy';
import { request, gql } from 'graphql-request';
import Layout from './Layout';
import LoadingLayer from './LoadingLayer';
import { TEZTOK_API, FA2_CONTRACT_8X8_COLOR } from '../consts';
import TokenGrid from './TokenGrid';

const LatestMintsQuery = gql`
  query getLatest {
    mint_events: events(
      where: {
        token: { metadata_status: { _eq: "processed" } }
        type: { _eq: "8BID_8X8_COLOR_MINT" }
        fa2_address: { _eq: "${FA2_CONTRACT_8X8_COLOR}" }
      }
      limit: 100
      order_by: { opid: desc }
    ) {
      id
      token {
        token_id
        name
        description
        editions
        price
        sales_count
        eightbid_creator_name
        eightbid_rgb
        artist_address
        artist_profile {
          alias
          description
        }
      }
    }
    sale_events: events(
      where: {
        token: { metadata_status: { _eq: "processed" } }
        implements: { _eq: "SALE" }
        fa2_address: { _eq: "${FA2_CONTRACT_8X8_COLOR}" }
      }
      limit: 150
      order_by: { opid: desc }
    ) {
      id
      token {
        token_id
        name
        description
        editions
        price
        sales_count
        eightbid_creator_name
        eightbid_rgb
        artist_address
        artist_profile {
          alias
          description
        }
      }
    }
  }
`;

function useLatest() {
  const { data, error } = useSWR('/latest', () => request(TEZTOK_API, LatestMintsQuery));

  return {
    mints: data && data.mint_events.map(({ token }) => token),
    sales:
      data &&
      uniqBy(
        data.sale_events.map(({ token }) => token),
        'token_id'
      ),
    error,
    isLoading: !data,
  };
}

function Home() {
  const { isLoading, mints, sales } = useLatest();

  if (isLoading) {
    return <LoadingLayer />;
  }

  return (
    <Layout>
      <div className="Home">
        <h1>Latest Mints</h1>
        <TokenGrid tokens={mints} />
        <h1>Latest Sales</h1>
        <TokenGrid tokens={sales} />
      </div>
    </Layout>
  );
}

export default Home;
