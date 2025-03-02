import Product from "./product.model.js";
import Category from "../category/category.model.js";

export const saveProduct = async (req, res) => {
  try {
    const data = req.body;
    const category = await Category.findOne({ name: data.category });

    if (!category) {
      return res.status(404).json({
        success: false,
        msg: "category not found",
      });
    }

    const product = new Product({
      ...data,
      category: category.id,
    });

    await product.save();

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error saving Publication",
      error: error.message
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const [total, products] = await Promise.all([
      Product.countDocuments({ state: true }),
      Product.find({ state: true })
        .skip(Number(offset))
        .limit(Number(limit))
    ]);

    res.status(200).json({
      total,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error getting products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error searching product",
      error: error.message,
    });
  }
};

export const getProductsOutOfStock = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const query = { state: true, stock: 0 };
    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .skip(Number(offset))
        .limit(Number(limit))
    ]);

    if (total == 0) {
      return res.status(404).json({
        success: true,
        msg: "There are no products out of stock",
      });
    }

    res.status(200).json({
      success: true,
      total,
      products,
    });
  } catch (error) {
   return res.status(500).json({
      success: false,
      msg: "Error getting products",
      error: error.message,
    });
  }
};

export const getBestSellingProducts = async (req, res) => {
  try {
    const products = await Product.find({ state: true })
      .sort({ sales: -1 })
      .limit(5)

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error getting products",
      error: error.message,
    });
  }
};

export const getProductsByName = async (req, res) => {
  try {
    const { name } = req.query;
    const { limit = 10, offset = 0 } = req.query;
    const query = { name: { $regex: `.*${name}.*`, $options: "i" } };

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .skip(Number(offset))
        .limit(Number(limit))
    ]);

    if (total == 0) {
      return res.status(200).json({
        success: true,
        msg: "There are no products that match the search.",
      });
    }
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error getting products",
      error: error.message,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const category = await Category.findOne({
      name: { $regex: `^${categoryName}$`, $options: "i" },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        msg: "Category not found.",
      });
    }

    const [total, products] = await Promise.all([
      Product.countDocuments({ category: category.id }),
      Product.find({ category: category.id })
        .skip(Number(offset))
        .limit(Number(limit))
    ]);

    if (total === 0) {
      return res.status(200).json({
        success: true,
        msg: `No products found in category: ${categoryName}`,
      });
    }

    res.status(200).json({
      success: true,
      total,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error getting products by category",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category,  ...data } = req.body;

    const newCategory = await Category.findOne({ name: category });

    if (!newCategory) {
      return res.status(404).json({
        success: false,
        msg: "Category not found",
      });
    }

    data.category = newCategory;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
      success: true,
      msg: "Product successfully updated",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      msg: "Product successfully removed",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error deleting product",
      error: error.message,
    });
  }
};
