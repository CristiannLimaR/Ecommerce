import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
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
      min: 0
    },

    stock: {
      type: Number,
      required: [true, "stock is required"],
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      autopopulate: {select: 'name -_id'}
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

ProductSchema.plugin(mongooseAutoPopulate)

export default model("Product", ProductSchema)