import express from 'express';

const router = express.Router();
router.post('/api/users/signin', 
async (req, res) => {
  res.send("Hi Signin!");
});

export { router as signinRouter };

