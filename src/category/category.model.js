import { Schema, model } from "mongoose";

const CategorySchema = Schema(
  {
    name: {
      type: String,
      required: [true, "The name is required"],
      maxLength: [25, "Cant be overcome 25 characters"],
      trim: true,
      set: (value) => value.toUpperCase()
    },
    state: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Category", CategorySchema);
