import Category from "./category.model.js";

export const getCategories = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const [total, categories] = await Promise.all([
      Category.countDocuments({ state: true }),
      Category.find({ state: true }).skip(Number(offset)).limit(Number(limit)),
    ]);

    res.status(200).json({
      success: true,
      total,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      msg: "Error  getting categories",
      error: error,
    });
  }
};


export const getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
  
      if (!category) {
        return res.status(404).json({
          success: false,
          msg: "Category not found",
        });
      }
  
      res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "error searching category",
        error: error.array(),
      });
    }
  };

export const saveCategory = async (req, res) => {
  try {
    const data = req.body;
    const category = new Category({
      ...data,
    });

    await category.save();

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error saving Category",
      error: error.message
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
      success: true,
      msg: "category successfully updated",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error updating category",
      error: error,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(
      id,
      { state: false },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      msg: "category successfully removed",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error updating category",
      error: error.array(),
    });
  }
};
