export default function Price({ amount }) {
  return <span className="Price">{`${(amount / 1000000).toFixed(2)} ꜩ`}</span>;
}
