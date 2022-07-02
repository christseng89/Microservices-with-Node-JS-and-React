import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  // console.log('I am in the component');
  // axios.get('/api/users/currentuser')
  // .catch(
  //   err => {
  //     // console.log(err.message)
  //   }
  // );

  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async () => {
  console.log('I am EXECUTED!');
  // const response = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser');

  // return response.data;
  return {};
};

export default LandingPage;

//#endregion