import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log('Current user is: ', currentUser);
  if (currentUser) {
    return <h1>You are login.</h1>;
  }
  return <h1>You are NOT login.</h1>;
};

LandingPage.getInitialProps = async () => {
  if (typeof window === 'undefined') {
    // we are on the server!
    // requests should be made to http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser
    try {
      const { data } = await axios.get(
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
        {
          headers: {
            Host: 'ticketing.com', // ingress-srv.yaml
          },
        }
      );
      return data;
    } catch (error) {
      return ({ currentUser: null });
    }
  } else {
    // we are on the browser!
    // requests can be made with a base url of ''
    try {
      const { data } = await axios.get('/api/users/currentuser');
      return data;
    } catch (error) {
      return ({ currentUser: null });
    }
  }
};

export default LandingPage;
