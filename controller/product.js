const ProductModel = require("../models/product");
const QuantityModel = require("../models/quantity");
const productJson = require("../lib/products.json");

const addProduct = (req, res, next) => {
  const { Name, Price, Details, Quantity, Sizes, SKU, Product_images } =
    req.body;

  const newQuantity = new QuantityModel({
    Quantity: Quantity,
  });

  try {
    newQuantity.save().then((quantity) => {
      const newProduct = new ProductModel({
        _id: quantity.ProductId,
        Name: Name,
        Price: Price,
        Details: Details,
        Quantity: quantity.ProductId,
        Sizes: Sizes,
        SKU: SKU,
        Product_images: Product_images,
      });
      newProduct
        .save()
        .then((product) => {
          res.status(200).json({ success: true });
        })
        .catch((err) => {
          res.status(500).json({ success: false, msg: err });
        });
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
};

const updateProduct = (req, res, next) => {
  try {
    const _id = req.params.id;
    const quantity = req.body.Quantity;
    delete req.body.Quantity;

    ProductModel.findByIdAndUpdate(_id, req.body, { new: true }).exec(
      (err, result) => {
        if (err || !result) {
          res.status(404).json({ success: false, msg: "Product Id not found" });
        } else if (quantity) {
          QuantityModel.findOneAndUpdate(
            { ProductId: result._id },
            { Quantity: quantity },
            { new: true }
          ).exec((err, qnt) => {
            if (err || !qnt) {
              res.status(400).json({
                success: false,
                msg: "Product Id not exist on Quantity",
              });
            } else {
              res.status(200).json({ success: true });
            }
          });
        } else {
          res.status(200).json({ success: true });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
};

const deleteProduct = (req, res, next) => {
  try {
    const _id = req.params.id;
    ProductModel.findByIdAndDelete(_id).exec((err, result) => {
      if (err || !result) {
        res.status(404).json({ success: false, msg: "Product Id not found" });
      } else {
        QuantityModel.findOneAndDelete({ ProductId: result._id }).exec(
          (err, qnt) => {
            if (err || !qnt) {
              res.status(400).json({
                success: false,
                msg: "Product Id not exist on Quantity",
              });
            }
            res.status(200).json({ success: true });
          }
        );
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
};

const allProducts = (req, res, next) => {
  try {
    const { page, total, sortBy, sortType } = req.body;
    ProductModel.find({})
      .populate({
        path: "Quantity",
        select: "Quantity -_id",
      })
      .limit(total)
      .skip(page * total)
      .sort([[sortBy, sortType == "asc" ? 1 : -1]])
      .exec((err, result) => {
        if (err || !result) {
          res.status(400).json({ success: false, msg: err });
        } else {
          res.status(200).json({ success: true, products: result });
        }
      });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
};

const oneProduct = (req, res, next) => {
  try {
    ProductModel.findById(req.params.productid)
      .populate({
        path: "Quantity",
        select: "Quantity -_id",
      })
      .exec((err, result) => {
        if (err || !result) {
          res.status(400).json({ success: false, msg: err });
        } else {
          res.status(200).json({ success: true, product: result });
        }
      });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
};

const importProduct = (req, res, next) => {
  res.status(200).json({ success: true, msg: "This is pending" });
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  allProducts,
  oneProduct,
  importProduct,
};
