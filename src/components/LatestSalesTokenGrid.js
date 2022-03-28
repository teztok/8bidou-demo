import { gql } from 'graphql-request';
import { FA2_CONTRACT_8X8_COLOR } from '../consts';
import LazyLoadTokenGrid from './LazyLoadTokenGrid';

function LatestSalesTokenGrid() {
  return (
    <LazyLoadTokenGrid
      headline="Latest Sales"
      namespace="latest-sales"
      resultsPath="sale_events"
      tokenPath="token"
      keyPath="opid"
      refreshInterval={5000}
      query={gql`
        query getLatestSales($limit: Int!) {
          sale_events: events(
            where: {
              token: { metadata_status: { _eq: "processed" } }
              implements: { _eq: "SALE" }
              fa2_address: { _eq: "${FA2_CONTRACT_8X8_COLOR}" }
            }
            limit: $limit
            order_by: { opid: desc }
          ) {
            opid
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

export default LatestSalesTokenGrid;
