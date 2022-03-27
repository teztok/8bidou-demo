export default function Price({ amount }) {
  return <div className="Price">{`${(amount / 1000000).toFixed(2)} ꜩ`}</div>;
}
