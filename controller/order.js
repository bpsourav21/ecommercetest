const ProductModel = require("../models/product");
const QuantityModel = require("../models/quantity");
const OrderModel = require("../models/order");
const ClientModel = require("../models/client");
const OrderItemModel = require("../models/orderItem");
const _ = require("underscore");

const placeOrder = (req, res, next) => {
  const { Name, Email, Phone, ProductList } = req.body;

  let productIdToQuantity = _.object(
    _.pluck(ProductList, "ProductId"),
    _.pluck(ProductList, "Quantity")
  );

  return runValidationProductQuantity(productIdToQuantity)
    .then((validated) => {
      return getClientId(Name, Email, Phone)
        .then((clientId) => {
          const newOrder = new OrderModel({
            ClientId: clientId,
          });
          try {
            newOrder.save().then((order) => {
              const orderItems = _.map(ProductList, (item) => {
                return new OrderItemModel({
                  ProductId: item.ProductId,
                  Quantity: item.Quantity,
                  TotalPrice: item.TotalPrice,
                  Size: item.Size,
                  OrderId: order._id,
                });
              });

              OrderItemModel.insertMany(orderItems)
                .then((orderItemsResult) => {
                  let promiseArr = [];
                  orderItemsResult.forEach((obj) =>
                    promiseArr.push(runDecreaseQuantity(obj))
                  );
                  Promise.all(promiseArr);
                  res.status(200).json({ success: true });
                })
                .catch((err) => {
                  res.status(500).json({ success: false, msg: err });
                });
            });
          } catch (err) {
            res.status(500).json({ success: false, msg: err });
          }
        })
        .catch((err) => {
          res.status(500).json({ success: false, msg: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: err });
    });
};

const getClientId = (Name, Email, Phone) => {
  return new Promise((resolve, reject) => {
    try {
      ClientModel.findOne({ Email: Email }).exec((err, client) => {
        if (err) {
          return reject(err);
        }
        if (client) {
          return resolve(client._id);
        } else {
          const newClient = new ClientModel({ Name, Email, Phone });
          try {
            newClient.save().then((client) => {
              return resolve(client._id);
            });
          } catch (err) {
            return reject(err);
          }
        }
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const runValidationProductQuantity = (productIdToQuantity) => {
  return new Promise((resolve, reject) => {
    // Validating if items and quantity are available
    QuantityModel.find({
      _id: { $in: Object.keys(productIdToQuantity) },
    }).exec((err, result) => {
      if (err) {
        return reject(err);
      } else if (result.length !== Object.keys(productIdToQuantity).length) {
        return reject("Some product id missing");
      } else {
        result.forEach((item) => {
          if (item.Quantity < productIdToQuantity[item.ProductId]) {
            return reject("Not enough quantity exist for " + item.ProducId);
          } else {
            return resolve("validated");
          }
        });
      }
    });
  });
};

const runDecreaseQuantity = (obj) => {
  return new Promise((resolve, reject) => {
    QuantityModel.findOneAndUpdate(
      { ProductId: obj.ProductId },
      { $inc: { Quantity: -1 * obj.Quantity } }
    )
      .exec()
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const findOrder = (req, res, next) => {
  try {
    OrderModel.findById(req.params.orderId)
      .populate("ClientId")
      // .aggregate([
      //   {
      //     $lookup: {
      //       from: "OrderItem",
      //       localField: "OrderId",
      //       foreignField: "OrderId",
      //       as: "ProductItem",
      //     },
      //   },
      // ])
      .exec((err, result) => {
        if (err || !result) {
          res.status(400).json({ success: false, msg: err });
        } else {
          res.status(200).json({ success: true, order: result });
        }
      });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
};

const findClient = (req, res, next) => {
  try {
    ClientModel.findById(req.params.clientsId)
      .populate("ClientId")
      .exec((err, result) => {
        if (err || !result) {
          res.status(400).json({ success: false, msg: err });
        } else {
          res.status(200).json({ success: true, clients: result });
        }
      });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
};

module.exports = {
  placeOrder,
  findOrder,
  findClient,
};
