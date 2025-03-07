import Cart from "./cart.model.js";
import Product from "../product/product.model.js";

export const getCart = async (req, res) => {
  try {
    const authenticatedUser = req.user;
    const cart = await Cart.findOne({ client: authenticatedUser.id });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        msg: "You have not added products to the cart",
        items: [],
        totalAmount: 0,
      });
    }

    res.status(200).json({
      success: true,
      msg: "Cart retrieved successfully",
      cart,
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
    const { quantity } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    if(!product.state){
      return res.status(404).json({
        success: false,
        msg: "Product inactive"
      })
    }

    if (product.stock === 0) {
      return res.status(400).json({
        success: false,
        msg: "Product out of stock",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        msg: "Requested quantity exceeds stock",
      });
    }

    let cart = await Cart.findOne({ client: authenticatedUser._id });

    if (!cart) {
      cart = new Cart({
        client: authenticatedUser._id,
        items: [{ product: product._id, quantity: Number(quantity), total: product.price * Number(quantity) }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex((item) =>
        item.product.equals(product._id)
      );

      if (existingItemIndex !== -1) {
        const existingItem = cart.items[existingItemIndex];

        if (existingItem.quantity + Number(quantity) > product.stock) {
          return res.status(400).json({
            success: false,
            msg: `Total quantity in cart exceeds product stock: ${product.name}`,
          });
        }

        existingItem.quantity += Number(quantity);
        existingItem.total += Number(quantity)*product.price
      } else {
        cart.items.push({ product: product._id, quantity: Number(quantity), total: product.price * Number(quantity) });
      }
    }

    cart.markModified("items");

    let totalAmount = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      totalAmount += product.price * item.quantity;
    }

    cart.totalAmount = totalAmount;

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
    const { items } = req.body;

    const cart = await Cart.findOne({ client: authenticatedUser.id });

    if (!cart) {
      cart = new Cart({
        client: authenticatedUser.id,
        items: items,
      });
    }

    let totalAmount = 0;
    const updatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          msg: `Product not found: ${item.product.name}`,
        });
      }

      if(!product.state){
        return res.status(404).json({
          success: false,
          msg: "Product inactive"
        })
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          msg: `Requested quantity exceeds stock for: ${product.name}`,
        });
      }

      updatedItems.push({
        product: product._id,
        quantity: item.quantity,
        total: product.price * item.quantity
      });

      totalAmount += product.price * item.quantity;
    }

    cart.items = updatedItems;
    cart.totalAmount = totalAmount;
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
    const { productId } = req.params;
    const cart = await Cart.findOne({ client: authenticatedUser.id });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        msg: "You have not added products to the cart",
        items: [],
        totalAmount: 0,
      });
    }

    const itemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        msg: "Product not found in the cart",
      });
    }

    cart.items.splice(itemIndex, 1);

    let totalAmount = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      totalAmount += product.price * item.quantity;
    }
    cart.totalAmount = totalAmount;

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
    const cart = await Cart.findOne({ client: authenticatedUser.id });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        msg: "You have not added products to the cart",
        items: [],
        totalAmount: 0,
      });
    }

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      msg: "Cart Successfully cleared",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Clearing cart error",
      error: error.message,
    });
  }
};
