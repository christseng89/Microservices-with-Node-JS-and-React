const LandingPage = ({ currentUser }) => {
  // console.log('Current user is: ', currentUser);
  return currentUser ? <h1>You are signed in.</h1> : <h1>You are NOT signed in.</h1>;
};

LandingPage.getInitialProps = async (_ctx, _client, _currentUser) => {
  return {};
};

export default LandingPage;
