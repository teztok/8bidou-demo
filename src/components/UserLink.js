import get from 'lodash/get';
import { Link } from 'react-router-dom';

export default function UserLink({ field, data }) {
  const label = get(data, `${field}_profile.alias`) ? get(data, `${field}_profile.alias`) : data[`${field}_address`];

  return (
    <div>
      <Link to={`/user/${data[`${field}_address`]}`}>{label}</Link>
    </div>
  );
}
