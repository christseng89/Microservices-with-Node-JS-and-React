import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  console.log('Current user is: ', currentUser);
  return currentUser ? <h1>You are signed in.</h1> : <h1>You are NOT signed in.</h1>;
};

LandingPage.getInitialProps = async (req) => {
  const client = buildClient(req);
  try {
    const { data } = await client.get('/api/users/currentuser');
    return data;   
  } catch (error) {
    return {};
  }
};

export default LandingPage;
