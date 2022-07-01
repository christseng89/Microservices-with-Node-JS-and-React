import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log('I am in the component');
  axios.get('/api/users/currentuser')
  .catch(
    err => {
      // console.log(err.message)
    }
  );

  return <h1>Landing Page</h1>;
};

// LandingPage.getInitialProps = async () => {
//   console.log('I am on the server!');
//   const response = await axios.get('/api/users/currentuser');

//   return response.data;
// };

export default LandingPage;

//#endregion