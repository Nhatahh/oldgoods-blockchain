const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const query = {};

    if (req.query.sellerWallet) {
      query.sellerWallet = req.query.sellerWallet.toLowerCase();
    }

    if (req.query.status && req.query.status !== "all") {
      query.status = req.query.status;
    }

    if (req.query.keyword) {
      const regex = new RegExp(req.query.keyword, "i");
      query.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
      ];
    }

    let sort = { createdAt: -1 };

    if (req.query.sortMode === "price-asc") {
      sort = { priceNative: 1 };
    } else if (req.query.sortMode === "price-desc") {
      sort = { priceNative: -1 };
    }

    const products = await Product.find(query).sort(sort);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy danh sách sản phẩm" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy chi tiết sản phẩm" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      priceNative,
      depositNative,
      category,
      imageUrl,
      sellerWallet,
    } = req.body;

    if (!sellerWallet) {
      return res.status(400).json({ message: "Thiếu sellerWallet" });
    }

    if (Number(depositNative) >= Number(priceNative)) {
      return res.status(400).json({ message: "Đặt cọc phải nhỏ hơn giá tổng" });
    }

    const product = await Product.create({
      title,
      description,
      priceNative,
      depositNative,
      category,
      imageUrl: imageUrl || "",
      sellerWallet: sellerWallet.toLowerCase(),
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi tạo sản phẩm" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const {
      title,
      description,
      priceNative,
      depositNative,
      category,
      imageUrl,
      sellerWallet,
    } = req.body;

    if (!sellerWallet || product.sellerWallet !== sellerWallet.toLowerCase()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa sản phẩm này" });
    }

    if (Number(depositNative) >= Number(priceNative)) {
      return res.status(400).json({ message: "Đặt cọc phải nhỏ hơn giá tổng" });
    }

    product.title = title;
    product.description = description;
    product.priceNative = priceNative;
    product.depositNative = depositNative;
    product.category = category;
    product.imageUrl = imageUrl || "";

    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi cập nhật sản phẩm" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { sellerWallet } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    if (!sellerWallet || product.sellerWallet !== sellerWallet.toLowerCase()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa sản phẩm này" });
    }

    if (product.status !== "available") {
      return res.status(400).json({
        message: "Chỉ có thể xóa sản phẩm khi còn ở trạng thái available",
      });
    }

    await product.deleteOne();

    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi xóa sản phẩm" });
  }
});

module.exports = router;
