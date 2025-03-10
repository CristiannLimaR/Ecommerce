import Invoice from "./invoice.model.js";
import Product from "../product/product.model.js";
import Cart from "../cart/cart.model.js";

export const completePurchase = async (req, res) => {
  try {
    const authenticatedUser = req.user;

    const cart = await Cart.findOne({ client: authenticatedUser._id });
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

      if(!item.product.state){
        return res.status(404).json({
          success: false,
          msg: "can not buy a inactive product",
        });
      }
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity, sales: +item.quantity },
      });
    }

    const invoice = new Invoice({
      client: cart.client,
      items: cart.items.map((item) => ({
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        total: item.total,
      })),
      totalAmount: cart.totalAmount,
    });

    await invoice.save();

    await Cart.findOneAndUpdate({ client: cart.client }, { items: [] });

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

export const getPurchases = async (req, res) => {
  try {
    const authenticatedUser = req.user;

    const [total, purchases] = await Promise.all([
      Invoice.countDocuments({ client: authenticatedUser.id }),
      Invoice.find({ client: authenticatedUser.id }),
    ]);

    if (total === 0) {
      return res.status(200).json({
        success: true,
        msg: "You have not made any purchases",
      });
    }

    res.status(200).json({
      success: true,
      total,
      purchases,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error getting purchases",
      error: error.message,
    });
  }
};

export const getInvoicesByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const [total, purchases] = await Promise.all([
      Invoice.countDocuments({ client: clientId }),
      Invoice.find({ client: clientId }),
    ]);

    if (total === 0) {
      return res.status(200).json({
        success: true,
        msg: "The customer has not made any purchases",
      });
    }

    res.status(200).json({
      success: true,
      total,
      purchases,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error getting purchases",
      error: error.message,
    });
  }
};

export const updateInvoices = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { items } = req.body;

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        msg: "Invoice not found",
      });
    }

    let totalAmount = 0;
    let updatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          msg: `Product not found`,
        });
      }

      if (!product.state) {
        return res.status(404).json({
          success: false,
          msg: "Product inactive",
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          msg: `Requested quantity exceeds stock for: ${product.name}`,
        });
      }

      updatedItems.push({
        product: product._id,
        price: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity
      });

      totalAmount += product.price * item.quantity;

      await Product.findByIdAndUpdate(product.id, {
        $inc: { stock: -item.quantity, sales: +item.quantity },
      });
    }

    invoice.items = updatedItems;
    invoice.totalAmount = totalAmount;
    await invoice.save();

    res.status(200).json({
      success: true,
      msg: "Invoice successfully updated",
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error updating invoice",
      error: error.message,
    });
  }
};
