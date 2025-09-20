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
    res.status(500).json({ error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    let imageUrl = req.body.image || null

    if (req.file) {
      imageUrl = await uploadToFTP(req.file) // upload new image to FTP
    }

    const updated = await Category.updateCategory(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      image: imageUrl,
    })
    console.log('updated == ', updated)

    res.json(updated)
  } catch (err) {
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
