import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  console.log('Current user is: ', currentUser);
  if (currentUser) {
    return <h1>You are login.</h1>;
  }
  return <h1>You are NOT login.</h1>;
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
