import useSWR from 'swr';
import { request, gql } from 'graphql-request';
import get from 'lodash/get';
import sum from 'lodash/sum';
import { validateAddress, ValidationResult } from '@taquito/utils';
import { shortenTzAddress } from '../libs/utils';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import { useWallet } from '@tezos-contrib/react-wallet-provider';
import CreationsTokenGrid from './CreationsTokenGrid';
import InventoryTokenGrid from './InventoryTokenGrid';
import Price from './Price';
import LoadingLayer from './LoadingLayer';
import UserListings from './UserListings';
import Error from './Error';
import NotFound from './NotFound';
import { TEZTOK_API, FA2_CONTRACT } from '../consts';

const UserQuery = gql`
  query getUser($address: String!) {
    sales: events_aggregate(where: {seller_address: {_eq: $address}, implements: {_eq: "SALE"}, fa2_address: {_eq: "${FA2_CONTRACT}"}, type: {_like: "8BID_%"}}) {
      aggregate {
        sum {
          volume: price
        }
      }
    }
    buys: events_aggregate(where: {buyer_address: {_eq: $address}, implements: {_eq: "SALE"}, fa2_address: {_eq: "${FA2_CONTRACT}"}, type: {_like: "8BID_%"}}) {
      aggregate {
        sum {
          volume: price
        }
      }
    }
    holdings: holdings(where: {fa2_address: {_eq: "${FA2_CONTRACT}"}, token: {last_sales_price: {_is_null: false}}, holder_address: {_eq: $address}, amount: {_gt: 0}}) {
      amount
      token {
        last_sales_price
      }
    }
    creations: tokens_aggregate(where: {artist_address: {_eq: $address}, fa2_address: {_eq: "${FA2_CONTRACT}"}, editions: {_gt: 0}}) {
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

  const portfolioValue = sum(get(data, 'holdings', []).map(({ amount, token }) => amount * token.last_sales_price));

  return {
    salesVolume: get(data, 'sales.aggregate.sum.volume'),
    buyVolume: get(data, 'buys.aggregate.sum.volume'),
    totalCreations: get(data, 'creations.aggregate.total'),
    portfolioValue,
    user: get(data, 'profile'),
    error,
    isLoading: isValidating,
  };
}

function MetaInfo({ label, children }) {
  return (
    <div className="UserDetail__MetaInfo">
      <span>{label}</span>
      <br />
      {children}
    </div>
  );
}

function UserDetail() {
  const { activeAccount } = useWallet();
  const { address } = useParams();
  const { salesVolume, buyVolume, user, totalCreations, portfolioValue, isLoading, error } = useUser(address);
  const isYou = activeAccount?.address === address;

  if (!(validateAddress(address) === ValidationResult.VALID)) {
    return <NotFound />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (isLoading) {
    return <LoadingLayer />;
  }

  let creationsHeadline;

  if (totalCreations > 0) {
    creationsHeadline = `${totalCreations} Creation${totalCreations !== 1 ? 's' : ''}`;
  } else {
    creationsHeadline = 'Creations';
  }

  return (
    <Layout>
      <div className="UserDetail">
        <h2>{isYou ? 'My Profile' : shortenTzAddress(address) + '`s Profile'}</h2>
        <div className="UserDetail__Meta">
          <MetaInfo label="Twitter">
            {get(user, 'twitter') ? <a href={`https://twitter.com/${user.twitter}`}>@{user.twitter}</a> : '–'}
          </MetaInfo>
          <MetaInfo label="Alias">{get(user, 'alias') ? <>{user.alias}</> : '–'}</MetaInfo>
          <MetaInfo label="Tacos Spent">
            <Price amount={buyVolume} />
          </MetaInfo>
          <MetaInfo label="Tacos Earned">
            <Price amount={salesVolume} />
          </MetaInfo>
          <MetaInfo label="Pixel Value">
            <Price amount={portfolioValue} />
          </MetaInfo>
        </div>

        {isYou ? <UserListings address={address} /> : null}

        <CreationsTokenGrid address={address} headline={creationsHeadline} />
        <InventoryTokenGrid address={address} />
      </div>
    </Layout>
  );
}

export default UserDetail;
