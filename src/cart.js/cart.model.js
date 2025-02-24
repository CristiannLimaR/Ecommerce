import { Schema, model} from "mongoose";

const CartSchema = Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
},
{
    timestamps: true,
    versionKey: false
});

export default model('Cart', CartSchema)
