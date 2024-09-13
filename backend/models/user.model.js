import mongoose from "mongoose";
import bcrypt from "bcryptjs";

 const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , "Name is required"]
    },
    email:{
        type: String,
        required: true,
        unique: [true, " email is required"],
        lowercase : true,
        trim: true
    },
    password:{
        type: String,
        required: [true, "password is required"],
        minelength: [6, "Password must be at least 6 character long"],
        unique: true,
        
    },
    cartItems: [
        {
          quantity: {
            type: Number,
            default: 1,
          },
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
        },
      ],
    role: {
        type: String,
        enum: ["customer",  "admin"],
        default: "customer"
    }
    

 }, {
    timestamps: true
 }
);


//pre-save hook to hash password before saving to database

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
  }
  catch(error) {
      next(error);
  }
});

userSchema.methods.comparePasswords = async function (password) {
    return bcrypt.compare(password,this.password);
};

const User = mongoose.model("User", userSchema);

export default User;