import { gql } from 'graphql-request';
import { FA2_CONTRACT_8X8_COLOR } from '../consts';
import LazyLoadTokenGrid from './LazyLoadTokenGrid';

function CreationsTokenGrid({ address, headline = 'Creations', filter }) {
  return (
    <LazyLoadTokenGrid
      headline={headline}
      namespace="creations"
      swrParams={[address]}
      resultsPath="tokens"
      variables={{ address }}
      filter={filter}
      query={gql`
      query getCreations($address: String!, $limit: Int!) {
        tokens(
          where: {
            fa2_address: { _eq: "${FA2_CONTRACT_8X8_COLOR}" }
            artist_address: { _eq: $address }
            editions: { _gt: 0 }
            eightbid_rgb: { _is_null: false }
          }
          limit: $limit
          order_by: { minted_at: desc }
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
      `}
    />
  );
}

export default CreationsTokenGrid;
