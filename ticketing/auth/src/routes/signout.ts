import express from 'express';

const router = express.Router();
router.post('/api/users/signout', async (req, res) => {
  // 1. Check if there is a JWT in the session object
  if (!req.session?.jwt) {
    return res.status(200).send({ currentUser: null });
  }

  // 2. Remove the session object  
  req.session = null;
  res.status(200).send({ currentUser: 'Signout success' });
});

export { router as signoutRouter };
//