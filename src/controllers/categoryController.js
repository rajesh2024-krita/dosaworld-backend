const Category = require("../models/categoryModel");
const uploadToFTP = require("../util/ftpUpload");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const cat = await Category.getCategoryById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCategory = async (req, res) => {
  console.log('createCategory')
  try {
    const { name, description } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToFTP(req.file);
    }
    console.log('name, description, imageUrl == ', name, description, imageUrl)

    const newCat = await Category.createCategory({
      name,
      description,
      image: imageUrl,
    });

    res.status(201).json(newCat);
  } catch (err) {
    res.status(500).json({ error: `error controller - ${err.message}` });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id

    // 1️⃣ Fetch existing category
    const existingCategory = await Category.getCategoryById(categoryId)
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" })
    }

    // 2️⃣ Prepare new data
    let imageUrl = existingCategory.image || null
    if (req.file) {
      imageUrl = await uploadToFTP(req.file)
    }

    const newData = {
      name: req.body.name || existingCategory.name,
      description: req.body.description || existingCategory.description,
      image: imageUrl,
    }

    // 3️⃣ Check if any field has changed
    const isChanged =
      newData.name !== existingCategory.name ||
      newData.description !== existingCategory.description ||
      newData.image !== existingCategory.image

    if (!isChanged) {
      return res.json({ message: "No changes detected, category not updated" })
    }

    // 4️⃣ Perform update
    const updated = await Category.updateCategory(categoryId, newData)
    console.log("updated == ", updated)

    res.json({ message: "Category updated successfully", data: updated })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}


const deleteCategory = async (req, res) => {
  try {
    await Category.deleteCategory(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
