import { Schema, model } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const InvoiceSchema = Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        autopopulate: {select: 'name surname -_id'}
    },
    items:[{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            autopopulate: {select: 'name '}
        },
        quantity: {
            type: Number,
            min:  1,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    state: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
    versionKey: false
})

InvoiceSchema.plugin(mongooseAutoPopulate);

export default model("Invoice", InvoiceSchema)
