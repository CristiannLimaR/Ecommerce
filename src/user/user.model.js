import { Schema, model } from "mongoose";

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
    maxLength: [25, 'Cant be overcome 25 characters']
  },
  email: {
    type: String,
    required: [true, "The email is obligatory"],
    unique: true,
  },
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    maxLength: [25, 'Cant be overcome 25 characters']
  },
  username: {
    type: String,
    unique: true
  },

  password: {
    type: String,
    required: [true, "The password is required"],
    minLength: 8
  },

  phone: {
    type: String,
    minLength: 8,
    maxLength: 8,
    required: [true, "The phone is obligatory"],
  },

  role: {
    type: String,
    enum: ["ADMIN_ROLE", "USER_ROLE"],
    default: "USER_ROLE"
  },
  state: {
    type: Boolean,
    default: true,
  }
},

  {
    timestamps: true,
    versionKey: false
  }
)

export default model('User', UserSchema)