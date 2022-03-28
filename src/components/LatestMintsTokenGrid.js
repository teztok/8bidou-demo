import { gql } from 'graphql-request';
import { FA2_CONTRACT_8X8_COLOR } from '../consts';
import LazyLoadTokenGrid from './LazyLoadTokenGrid';

function LatestMintsTokenGrid() {
  return (
    <LazyLoadTokenGrid
      headline="Latest Mints"
      namespace="latest-mints"
      resultsPath="mint_events"
      tokenPath="token"
      keyPath="token.token_id"
      refreshInterval={500000}
      query={gql`
        query getLatestMints($limit: Int!) {
          mint_events: events(
            where: {
              token: {
                metadata_status: { _eq: "processed" }
                editions: { _gt: 0 }
              }
              type: { _eq: "8BID_8X8_COLOR_MINT" }
              fa2_address: { _eq: "${FA2_CONTRACT_8X8_COLOR}" }
            }
            limit: $limit
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
      `}
    />
  );
}

export default LatestMintsTokenGrid;
