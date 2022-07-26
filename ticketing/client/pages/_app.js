import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
       <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (req) => {
  const client = buildClient(req.ctx);
  // Object.keys(req) => [ 'AppTree', 'Component', 'router', 'ctx' ]
  try {
    console.log(new Date().toLocaleTimeString(), 'AppComponent.getInitialProps');
    const { data } = await client.get('/api/users/currentuser');

    // pageProps is an object that will be passed to the component
    let pageProps = {};
    if (req.Component.getInitialProps) {
      pageProps = await req.Component.getInitialProps(req.ctx, client, data.currentUser);
    }
    return {pageProps, ...data};
  } catch (error) {
    return {};
  }
};

export default AppComponent;
