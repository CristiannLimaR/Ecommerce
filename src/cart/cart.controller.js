import Cart from "./cart.model.js";
import Product from "../product/product.model.js";

export const getCart = async (req, res) => {
  try {
    const authenticatedUser = req.user;
    const cart = await Cart.findOne({ client: authenticatedUser.id }).populate(
      "items.product"
    );

    if (!cart || cart.items === 0) {
      return res.status(200).json({
        msg: "You have not added products to the cart",
        items: [],
        total: 0,
      });
    }

    res.status(200).json({
      msg: "Cart retrieved successfully",
      items: cart.items,
      total: cart.total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error getting cart",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const authenticatedUser = req.user;
    const { productName, quantity } = req.body;
    const product = await Product.findOne({
      name: { $regex: productName, $options: "i" },
    });

    if (!product) {
      return res.status(404).json({ message: "Producto not found" });
    }

    if (product.stock === 0) {
      return res.status(400).json({ message: "Product out of stock" });
    }

    if (quantity > product.stock) {
      return res
        .status(400)
        .json({ message: "Requested quantity exceeds stock" });
    }

    let cart = await Cart.findOne({ client: authenticatedUser.id });

    if (!cart) {
      cart = new Cart({
        client: authenticatedUser.id,
        items: [{ product: product.id, quantity: Number(quantity) }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === product.id.toString()
      );

      if (existingItemIndex !== -1) {
        const existingItem = cart.items[existingItemIndex];

        if (existingItem.quantity + Number(quantity) > product.stock) {
          return res.status(400).json({
            message: `Total quantity in cart exceeds product stock: ${product.name}`,
          });
        }

        cart.items[existingItemIndex].quantity += Number(quantity);
      } else {
        cart.items.push({ product: product.id, quantity: Number(quantity) });
      }
    }
    cart.markModified("items");

    let total = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      total += product.price * item.quantity;
    }
    cart.total = total;

    await cart.save();
    res.status(200).json({
      success: true,
      msg: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error adding to cart",
      error: error.message,
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const authenticatedUser = req.user;
    const { quantity } = req.body;
    const cart = await Cart.findOne({ client: authenticatedUser.id });

    if (!cart || cart.items === 0) {
      return res.status(200).json({
        msg: "You have not added products to the cart",
        items: [],
        total: 0,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.id.toString() === req.params.productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    const item = cart.items[itemIndex];
    const product = await Product.findById(item.product);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (item.quantity + quantity > product.stock) {
      return res.status(400).json({
        msg: `Total quantity in cart exceeds product stock: ${product.name}`,
      });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    let total = 0;
    cart.items.map(async (item) => {
      const product = await Product.findById(item.product);
      total += product.price * item.quantity;
    });

    cart.total = total;

    await cart.save();
    res.status(200).json({
      success: true,
      msg: "Cart successfully updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error updating cart",
      error: error.message,
    });
  }
};

export const deleteProductOfCart = async (req, res) => {
  try {
    const authenticatedUser = req.user;
    const cart = await Cart.findOne({ user: authenticatedUser.id });

    if (!cart || cart.items === 0) {
      return res.status(200).json({
        msg: "You have not added products to the cart",
        items: [],
        total: 0,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.id.toString() === req.params.productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    cart.items.splice(itemIndex, 1);

    let total = 0;
    cart.items.map(async (item) => {
      const product = await Product.findById(item.product);
      total += product.price * item.quantity;
    });

    cart.total = total;

    await cart.save();

    res.status(200).json({
      success: true,
      msg: "Product successfully removed to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error removing product to cart",
      error: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const authenticatedUser = req.user;
    const cart = await Cart.findOne({ user: authenticatedUser.id });

    if (!cart || cart.items === 0) {
      return res.status(200).json({
        msg: "You have not added products to the cart",
        items: [],
        total: 0,
      });
    }

    cart.items = [];
    cart.total = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      msg: "Cart Successfully cleared",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Clearing cart error",
      error: error.message,
    });
  }
};
