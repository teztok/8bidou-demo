import { gql } from 'graphql-request';
import { FA2_CONTRACT, EVENT_TYPE_PREFIX } from '../consts';
import LazyLoadTokenGrid from './LazyLoadTokenGrid';

function LatestMintsTokenGrid() {
  return (
    <LazyLoadTokenGrid
      headline="Latest Mints"
      namespace="latest-mints"
      resultsPath="mint_events"
      tokenPath="token"
      keyPath="token.token_id"
      refreshInterval={5000}
      query={gql`
        query getLatestMints($limit: Int!) {
          mint_events: events(
            where: {
              token: {
                metadata_status: { _eq: "processed" }
                editions: { _gt: 0 }
                eightbid_rgb: { _is_null: false }
              }
              type: { _eq: "${EVENT_TYPE_PREFIX}_MINT" }
              fa2_address: { _eq: "${FA2_CONTRACT}" }
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
