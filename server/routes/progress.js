const router = require("express").Router();
const Progress = require("../models/Progress");
const User = require("../models/User");

// COMPLETE LAB
router.post("/complete", async (req,res)=>{
  const { userId, labId, xp } = req.body;

  await Progress.create({ userId, labId, completed:true });

  const user = await User.findById(userId);
  user.xp += xp;
  user.level = Math.floor(user.xp / 500) + 1;

  await user.save();

  res.json(user);
});

module.exports = router;