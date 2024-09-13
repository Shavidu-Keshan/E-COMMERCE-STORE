import User from "../models/user.model";


export const signup = async (req, res) => {
  const {email,password,name} = req.body
  try {
    const userExists = await User.findOne({email});

  if(userExists) {
    return res.status(400).json({message:"User already exists"});
  }
  const user = await User.create({name,email,password});

  res.status(200).json({message:"User created successfully",user});
}
   catch (error) {
    res.status(500).json({message:"Something went wrong",error});
  }
}
export const login = async (req, res) => {
  res.send("login route called");
};

export const logout = async (req, res) => {
  res.send("logout route called");
};

