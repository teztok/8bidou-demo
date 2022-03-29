import Layout from './Layout';

export default function Error({ error }) {
  console.log('error', error);
  return (
    <Layout>
      <h2>Oops, an error occurred.</h2>
      <div className="CodeError">
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    </Layout>
  );
}
