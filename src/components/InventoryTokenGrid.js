import { gql } from 'graphql-request';
import { FA2_CONTRACT } from '../consts';
import LazyLoadTokenGrid from './LazyLoadTokenGrid';

function InventoryTokenGrid({ address }) {
  return (
    <LazyLoadTokenGrid
      headline="Inventory"
      namespace={`inventory_${address}`}
      swrParams={[address]}
      resultsPath="holdings"
      tokenPath="token"
      keyPath="token.token_id"
      variables={{ address }}
      itemsPerLoad={48}
      query={gql`
      query getInventory($address: String!, $limit: Int!) {
        holdings(
          where: {
            holder_address: { _eq: $address }
            amount: { _gt: "0" }
            fa2_address: { _eq: "${FA2_CONTRACT}" }
            token: { eightbid_rgb: { _is_null: false } }
          }
          limit: $limit
          order_by: [{ token: { artist_address: asc } }, { token: { minted_at: desc } }]
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
      }
      `}
    />
  );
}

export default InventoryTokenGrid;
