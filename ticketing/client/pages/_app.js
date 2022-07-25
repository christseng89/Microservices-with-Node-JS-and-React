import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (req) => {
  const client = buildClient(req.ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {};
  if (req.Component.getInitialProps) {
    pageProps = await req.Component.getInitialProps(
      req.ctx, client, data.currentUser
    );
  }
  return {pageProps, ...data};
};

export default AppComponent;
