import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  let userInfo = '';
  if (currentUser) {
    userInfo = 'Current User: ' + currentUser.email;
  }

  return (
    <div>
      <h1>Header! {userInfo}</h1>
      <Component {...pageProps} />
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
