import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
       <Component {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (req) => {
  const client = buildClient(req.ctx);
  // console.log(Object.keys(req)); // [ 'AppTree', 'Component', 'router', 'ctx' ]
  try {
    const { data } = await client.get('/api/users/currentuser');

    // pageProps is an object that will be passed to the component
    let pageProps = {};
    if (req.Component.getInitialProps) {
      pageProps = await req.Component.getInitialProps(req.ctx);
      // console.log('Page Props :', pageProps); 
    }
    return {pageProps, ...data};
  } catch (error) {
    return {};
  }
};

export default AppComponent;
