const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const generateToken = require('../config/generateToken');


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all the fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token:generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Failed to create the user');
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Email or Password');
  }
});

const allUsers=asyncHandler(async(req,res)=>{
  const keyword=req.query.search?{
    $or:[
      {name:{$regex: req.query.search, $options: "i"}},
      {email:{$regex: req.query.search, $options: "i"}}
    ]
  }:{};
  const users=await ( User.find(keyword)).find({_id:{$ne:req.user._id}})
  res.send(users)
  console.log(keyword)
})
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, pic } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, pic },
    { new: true, runValidators: true }
  ).select('-password');

  if (!updatedUser) {
    res.status(404);
    throw new Error("User not found.");
  }

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    pic: updatedUser.pic,
    token: generateToken(updatedUser._id),
  });
});


module.exports = { registerUser, authUser,allUsers,updateUserProfile };

