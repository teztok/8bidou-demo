import useSWR from 'swr';
import { request, gql } from 'graphql-request';
import { useParams } from 'react-router-dom';
import { TEZTOK_API, FA2_CONTRACT_8X8_COLOR } from '../consts';
import TokenGrid from './TokenGrid';
import Layout from './Layout';
import LoadingLayer from './LoadingLayer';

const HoldingsQuery = gql`
  query getHoldings($tzAddressOrAlias: String!) {
    holdings(
      where: {
        _or: [{ holder_address: { _eq: $tzAddressOrAlias } }, { holder_profile: { alias: { _eq: $tzAddressOrAlias } } }]
        amount: { _gt: "0" }
        fa2_address: { _eq: "${FA2_CONTRACT_8X8_COLOR}" }
      }
    ) {
      holder_address
      holder_profile {
        alias
        description
      }
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
    tokens(
      where: {
        fa2_address: { _eq: "${FA2_CONTRACT_8X8_COLOR}" }
        _or: [{ artist_address: { _eq: $tzAddressOrAlias } }, { artist_profile: { alias: { _eq: $tzAddressOrAlias } } }]
      }
    ) {
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
`;

function useHoldings(tzAddressOrAlias) {
  const { data, error } = useSWR(['/user', tzAddressOrAlias], (key, tzAddressOrAlias) =>
    request(TEZTOK_API, HoldingsQuery, { tzAddressOrAlias })
  );

  return {
    holdings: data && data.holdings.map(({ token }) => token),
    creations: data && data.tokens,
    isLoading: !data,
    error,
  };
}

function UserDetail() {
  const { tzAddressOrAlias } = useParams();
  const { creations, holdings, isLoading } = useHoldings(tzAddressOrAlias);

  if (isLoading) {
    return <LoadingLayer />;
  }

  return (
    <Layout>
      <div className="UserDetail">
        <h2>Creations</h2>
        <TokenGrid tokens={creations} />

        <h2>Inventory</h2>
        <TokenGrid tokens={holdings} />
        <pre>{JSON.stringify(holdings, null, 2)}</pre>
        <pre>{JSON.stringify(creations, null, 2)}</pre>
      </div>
    </Layout>
  );
}

export default UserDetail;
