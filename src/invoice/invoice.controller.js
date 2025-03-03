import Invoice from "./invoice.model.js";
import Product from "../product/product.model.js";
import Cart from "../cart/cart.model.js";


export const completePurchase = async (req, res) => {
  try {
    const authenticatedUser = req.user;

    const cart = await Cart.findOne({ client: authenticatedUser.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "Cart is empty",
      });
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          msg: `Not enough stock for ${item.product.name}`,
        });
      }
    }

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity, sales: item.quantity},
      });
    }

    const invoice = new Invoice({
      client: cart.client,
      items: cart.items.map((item) => ({
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount: cart.total,
    });

    await invoice.save();

    await Cart.findOneAndUpdate({client: cart.client}, { items: [] });


    res.status(200).json({
      success: true,
      msg: "Purchase Completed",
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error completing purchase",
      error: error.message,
    });
  }
};

export const getPurchases  = async (req, res) => {
  try {
    const authenticatedUser = req.user;

    const [total, purchases] = await Promise.all([
      Invoice.countDocuments({client: authenticatedUser.id}),
      Invoice.find({client: authenticatedUser.id})
    ])

    if(total === 0){
      return res.status(200).json({
        success: true,
        msg: 'You have not made any purchases'
      })
    }

    res.status(200).json({
      success: true,
      total,
      purchases
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error getting purchases",
      error: error.message,
    });
  }
}

