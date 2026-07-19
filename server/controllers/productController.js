const Product = require("../models/Product");

// Create Product (Admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock, image, images, status } = req.body;

    if (!name || !description || !price || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields"
      });
    }

    const mainImage = image || (images && images.length > 0 ? images[0] : "");
    const imageList = images && images.length > 0 ? images : (mainImage ? [mainImage] : []);

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      brand,
      stock: Number(stock) || 0,
      image: mainImage,
      images: imageList,
      status: status || (Number(stock) === 0 ? "Out of Stock" : "Active"),
      seller: req.user?._id
    });

    res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Products (Supports Search, Filters, Sorting & Pagination)
const getProducts = async (req, res) => {
  try {
    const { search, category, brand, status, sort, page = 1, limit = 12 } = req.query;

    let query = {};

    // Search query
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ name: regex }, { description: regex }, { brand: regex }, { category: regex }];
    }

    // Category filter
    // Category filter
if (category && category !== "All") {

  if (category === "Fashion") {
    query.category = {
      $in: ["Men Fashion", "Women Fashion", "Footwear"]
    };
  }

  else if (category === "Electronics") {
    query.category = {
      $in: ["Mobiles", "Laptops", "Audio", "Accessories"]
    };
  }

  else {
    query.category = category;
  }
}

    // Brand filter
    if (brand && brand !== "All") {
      query.brand = brand;
    }

    // Status filter
    if (status && status !== "All") {
      query.status = status;
    }

    // Sort order
    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") {
      sortOption = { price: 1 };
    } else if (sort === "price-desc") {
      sortOption = { price: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "name-asc") {
      sortOption = { name: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalProducts / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: pageNum,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Product
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Product (Admin)
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const updateData = { ...req.body };
    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
      if (updateData.stock === 0 && !updateData.status) {
        updateData.status = "Out of Stock";
      }
    }

    if (updateData.images && updateData.images.length > 0) {
      updateData.image = updateData.images[0];
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Product (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
};