import UserLink from './UserLink';

export default function HoldingsTable({ holdings }) {
  if (!holdings || !holdings.length) {
    return (
      <div>
        <em>no results</em>
      </div>
    );
  }

  return (
    <table className="HoldingsTable">
      <tbody>
        {holdings.map((holding) => (
          <tr key={holding.holder_address}>
            <td>
              {holding.amount} x <UserLink data={holding} field="holder" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
