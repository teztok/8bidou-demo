import { useState } from 'react';
import useSWR from 'swr';
import { request, gql } from 'graphql-request';
import get from 'lodash/get';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Price from './Price';
import CancelSwapButton from './CancelSwapButton';
import Preview from './Preview';
import UserLink from './UserLink';
import { Link } from 'react-router-dom';
import { TEZTOK_API, FA2_CONTRACT_8X8_COLOR } from '../consts';

const UserListingsQuery = gql`
  query getUserListings($address: String!) {
    listings(where: {seller_address: {_eq: $address}, type: {_eq: "8BID_8X8_COLOR_SWAP"}, fa2_address: {_eq: "${FA2_CONTRACT_8X8_COLOR}"}}, order_by: { created_at: desc }) {
      swap_id
      created_at
      seller_address
      price
      amount
      amount_left
      status
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

function useUserListings(address) {
  const { data, error, isValidating } = useSWR(
    ['/user-listings', address],
    (key, address) => request(TEZTOK_API, UserListingsQuery, { address }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  return {
    listings: get(data, 'listings'),
    error,
    isLoading: isValidating,
  };
}

function UserListings({ address, showCancelButton = true, headline = 'My Listings' }) {
  const { listings, isLoading, error } = useUserListings(address);
  const [showAllListings, setShowAllListings] = useState(false);

  if (error) {
    return (
      <div className="UserListings UserListings--Error">
        <h2>{headline}</h2>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="UserListings UserListings--Loading">
        <h2>{headline}</h2>
        <span>LOADING...</span>
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="UserListings UserListings--NoResults">
        <h2>{headline}</h2>
        <span>...</span>
      </div>
    );
  }

  return (
    <div className="UserListings">
      <h2>{headline}</h2>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={showAllListings}
              onChange={() => {
                setShowAllListings(!showAllListings);
              }}
            />
          }
          label="Show Inactive"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Swap</th>
            <th>Artist</th>
            <th>Amount</th>
            <th>Sold</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {listings
            .filter((listing) => showAllListings || listing.status === 'active')
            .map((listing) => (
              <tr key={listing.created_at}>
                <td>
                  #{listing.swap_id}
                  <Link to={`/token/${listing.token.token_id}`}>
                    <Preview rgb={listing.token.eightbid_rgb} />
                  </Link>
                </td>
                <td>
                  <UserLink field="artist" data={listing.token} />
                </td>
                <td>{listing.amount}</td>
                <td>
                  {listing.amount - listing.amount_left} x <Price amount={listing.price} /> ={' '}
                  <Price amount={(listing.amount - listing.amount_left) * listing.price} />
                </td>
                <td>{listing.status}</td>
                <td>{showCancelButton && listing.status === 'active' ? <CancelSwapButton listing={listing} showPrice={false} /> : null}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserListings;
