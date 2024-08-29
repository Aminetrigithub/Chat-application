import  {mongoose}  from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
  image: { type: String, required: false },
  profileSetup: { type: Boolean, default: false },
  color: { type: Number, required: false },
});



UserSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hashSync(this.password, salt, (err) => {console.log(err) });
next()
});

let userModel = mongoose.model("User", UserSchema);

export default userModel;
