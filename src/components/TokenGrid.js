import Token from './Token';

function TokenGrid({ tokens }) {
  if (!tokens) {
    return (
      <div>
        <em>loading</em>
      </div>
    );
  }

  if (!tokens.length) {
    return (
      <div>
        <em>no results</em>
      </div>
    );
  }

  return (
    <div className="TokenGrid">
      {tokens.map((token) => (
        <Token key={token.token_id} token={token} />
      ))}
    </div>
  );
}

export default TokenGrid;
