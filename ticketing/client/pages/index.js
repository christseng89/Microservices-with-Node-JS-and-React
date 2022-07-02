import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  // console.log('I am EXECUTED in the Browser!', currentUser);
  // axios.get('/api/users/currentuser');

  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async () => {
  if (typeof window === 'undefined') {
    // we are on the server!
    // requests should be made to http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser
    console.log('I am EXECUTED in the server!');
  } else {
    // we are on the browser!
    // requests can be made with a base url of ''
  }
  return {};
};

export default LandingPage;

//#endregion