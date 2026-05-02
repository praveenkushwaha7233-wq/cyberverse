const router = require("express").Router();
const Lab = require("../models/Lab");

// GET ALL LABS
router.get("/", async (req,res)=>{
  const labs = await Lab.find();
  res.json(labs);
});

// ADD LAB (ADMIN)
router.post("/", async (req,res)=>{
  const lab = new Lab(req.body);
  await lab.save();
  res.json(lab);
});

module.exports = router;