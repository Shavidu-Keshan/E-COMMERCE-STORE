import { redis } from "../lib/redis.js";
import User from "../models/user.model.js"; 
import jwt from "jsonwebtoken"; 

const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  })

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
} )

return{ accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 60 * 60 * 24 * 7);//7days
  
}

const setCookies = (res,accessToken,refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevent xss attack
    secure:process.env.NODE_ENV === "production",
    sameSite: "strict",//prevent csrf attack, cross site request forgery attack
    maxAge: 15 * 60 * 1000, // 15min
  })
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //prevent xss attack
    secure:process.env.NODE_ENV === "production",
    sameSite: "strict",//prevent csrf attack, cross site request forgery attack
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
})
}

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });

    // authenticate 
    const {accessToken, refreshToken}=generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res,accessToken,refreshToken);

    res.status(201).json({ 
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
     
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const login = async (req, res) => {
  try {
    
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    

    if(user && (await user.comparePasswords(password))){
      const {accessToken, refreshToken}=generateToken(user._id);
      console.log("user is logged in");
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res,accessToken,refreshToken);

      res.json({ user:{
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }});

    }else{
      res.status(401).json({message: "Invalid email or password"});
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken  = req.cookies.refreshToken;
    if(refreshToken){
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      await redis.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({message: "Logged out successfully"});
  }catch(error){
    console.log("Error in logout controller", error.message);
    res.status(500).json({message: "Server eroor", error:error.message});
};
}
export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
