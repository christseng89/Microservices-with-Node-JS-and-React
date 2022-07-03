import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <h1>Header!</h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (req) => {
  const client = buildClient(req.ctx);
  console.log(Object.keys(req)); // [ 'AppTree', 'Component', 'router', 'ctx' ]
  try {
    const { data } = await client.get('/api/users/currentuser');
    console.log('Data in App.js :', data);
    // [client] Data in App.js : {
    // [client]   currentUser: {
    // [client]     id: '62c1451c26b9d6b6556614fa',
    // [client]     email: 'test@test.com',
    // [client]     iat: 1656833308
    // [client]   }
    // [client] }
    return data; 
  } catch (error) {
    return {};
  }
};

export default AppComponent;
