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
  const [showActiveListings, setShowActiveListings] = useState(true);

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

  const filteredListings = listings.filter((listing) => !showActiveListings || listing.status === 'active');

  return (
    <div className="UserListings">
      <h2>
        {headline}
        <div className="UserListings__Toggle">
          <FormControlLabel
            sx={{ mr: 0 }}
            control={
              <Checkbox
                checked={showActiveListings}
                onChange={() => {
                  setShowActiveListings(!showActiveListings);
                }}
                size="small"
                sx={{
                  pt: 0,
                  pb: 0,
                  pl: 0,
                  color: 'black',
                  '&.Mui-checked': {
                    color: 'blue',
                  },
                }}
              />
            }
            label="Show active only"
          />
        </div>
      </h2>
      {!filteredListings.length ? (
        <>You have {listings.length} inactive listings...</>
      ) : (
        <>
          <table>
            <tbody>
              {filteredListings.map((listing) => (
                <tr key={listing.created_at}>
                  <td>
                    <Link to={`/token/${listing.token.token_id}`}>
                      <Preview rgb={listing.token.eightbid_rgb} />
                    </Link>
                  </td>
                  <td>
                    <UserLink field="artist" data={listing.token} />
                  </td>
                  <td>{listing.amount} ed.</td>
                  <td>
                    {listing.amount - listing.amount_left} x <Price amount={listing.price} />
                  </td>
                  <td>
                    <Price amount={(listing.amount - listing.amount_left) * listing.price} /> earned
                  </td>
                  <td>
                    {showCancelButton && listing.status === 'active' ? (
                      <CancelSwapButton listing={listing} showPrice={false} />
                    ) : (
                      <>{listing.status}</>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default UserListings;
