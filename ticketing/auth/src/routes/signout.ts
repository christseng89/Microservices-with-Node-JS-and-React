import express from 'express';

const router = express.Router();
router.post('/api/users/signout', 
async (req, res) => {
  req.session = null;
  res.status(200).send({ message: 'Signout success' });
});

export { router as signoutRouter };
//