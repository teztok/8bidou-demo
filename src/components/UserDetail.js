import useSWR from 'swr';
import { request, gql } from 'graphql-request';
import get from 'lodash/get';
import { validateAddress, ValidationResult } from '@taquito/utils';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import { useWallet } from '@tezos-contrib/react-wallet-provider';
import { shortenTzAddress } from '../libs/utils';
import CreationsTokenGrid from './CreationsTokenGrid';
import InventoryTokenGrid from './InventoryTokenGrid';
import Price from './Price';
import LoadingLayer from './LoadingLayer';
import Error from './Error';
import NotFound from './NotFound';
import { TEZTOK_API, FA2_CONTRACT_8X8_COLOR } from '../consts';

const UserQuery = gql`
  query getUser($address: String!) {
    sales: events_aggregate(where: {seller_address: {_eq: $address}, implements: {_eq: "SALE"}, fa2_address: {_eq: "${FA2_CONTRACT_8X8_COLOR}"}, type: {_like: "8BID_%"}}) {
      aggregate {
        sum {
          volume: total_price
        }
      }
    }
    buys: events_aggregate(where: {buyer_address: {_eq: $address}, implements: {_eq: "SALE"}, fa2_address: {_eq: "${FA2_CONTRACT_8X8_COLOR}"}, type: {_like: "8BID_%"}}) {
      aggregate {
        sum {
          volume: total_price
        }
      }
    }
    holdings: holdings_aggregate(where: {holder_address: {_eq: $address}, fa2_address: {_eq: "${FA2_CONTRACT_8X8_COLOR}"}}) {
      aggregate {
        sum {
          total: amount
        }
      }
    }
    creations: tokens_aggregate(where: {artist_address: {_eq: $address}, fa2_address: {_eq: "${FA2_CONTRACT_8X8_COLOR}"}}) {
      aggregate {
        total: count(columns: token_id)
      }
    }
    profile: tzprofiles_by_pk(account: $address) {
      account
      alias
      twitter
      description
    }
  }
`;

function useUser(address) {
  const { data, error, isValidating } = useSWR(['/user', address], (key, address) => request(TEZTOK_API, UserQuery, { address }), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  return {
    salesVolume: get(data, 'sales.aggregate.sum.volume'),
    buyVolume: get(data, 'buys.aggregate.sum.volume'),
    totalCreations: get(data, 'creations.aggregate.total'),
    user: get(data, 'profile'),
    error,
    isLoading: isValidating,
  };
}

function UserDetail() {
  const { activeAccount } = useWallet();
  const { address } = useParams();
  const { salesVolume, buyVolume, user, totalCreations, isLoading, error } = useUser(address);

  if (!(validateAddress(address) === ValidationResult.VALID)) {
    return <NotFound />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (isLoading) {
    return <LoadingLayer />;
  }

  return (
    <Layout>
      <div className="UserDetail">
        <h2>{activeAccount?.address === address ? 'My Profile' : shortenTzAddress(address)}</h2>
        <div className="UserDetail__Meta">
          {get(user, 'alias') ? (
            <div className="UserDetail__MetaInfo">
              <span>ALIAS</span>
              <br />
              {user.alias}
            </div>
          ) : null}

          {get(user, 'twitter') ? (
            <div className="UserDetail__MetaInfo">
              <span>TWITTER</span>
              <br />
              <a href={`https://twitter.com/${user.twitter}`}>@{user.twitter}</a>
            </div>
          ) : null}

          {get(user, 'description') ? (
            <div className="UserDetail__MetaInfo">
              <span>DESCRIPTION</span>
              <br />
              {user.description}
            </div>
          ) : null}

          <div className="UserDetail__MetaInfo">
            <span>TACOS SPENT</span>
            <br />
            <Price amount={buyVolume} />
          </div>

          <div className="UserDetail__MetaInfo">
            <span>TACOS CLAIMED</span>
            <br />
            <Price amount={salesVolume} />
          </div>
        </div>

        <CreationsTokenGrid address={address} headline={`${totalCreations} Creation${totalCreations !== 1 ? 's' : ''}`} />
        <InventoryTokenGrid address={address} />
      </div>
    </Layout>
  );
}

export default UserDetail;
