import { Schema, model } from "mongoose";

const ProductSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },

    description: {
      type: String,
      required: [true, "description is required"],
    },

    price: {
      type: Number,
      required: [true, "price is required"],
    },

    stock: {
      type: Number,
      required: [true, "stock is required"],
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    sales: {
      type: Number,
      default: 0,
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

export default model("Product", ProductSchema)