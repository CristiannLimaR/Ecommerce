import { Schema, model} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const CartSchema = Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    autopopulate: {select: 'name surname email'}
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        autopopulate: {select: 'name price stock'}
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

CartSchema.plugin(mongooseAutoPopulate)

export default model('Cart', CartSchema)
