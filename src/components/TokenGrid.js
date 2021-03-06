import Token from './Token';

function TokenGrid({ tokens }) {
  if (!tokens || !tokens.length) {
    return (
      <div>
        <em>no results</em>
      </div>
    );
  }

  return (
    <div className="TokenGrid">
      {tokens.map((token) => (
        <Token key={token.key} token={token} />
      ))}
    </div>
  );
}

export default TokenGrid;
