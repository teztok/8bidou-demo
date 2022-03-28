export default function Price({ amount }) {
  let priceFixed = (amount / 1000000).toFixed(2);
  if (priceFixed.endsWith('.00')) {
    priceFixed = priceFixed.slice(0, -3);
  }
  return <span className="Price">{`${priceFixed}🌮`}</span>;
}
