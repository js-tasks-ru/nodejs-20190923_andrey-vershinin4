const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const {product: productId, phone, address} = ctx.request.body;

  // create order
  const order = new Order({
    user: ctx.user.id,
    product: productId,
    phone,
    address,
  });

  await order.save();

  // find product
  const product = await Product.findOne({_id: productId});

  // send order-confirmation
  await sendMail({
    to: ctx.user.email,
    subject: 'Заказ успешно создан',
    locals: {id: order.id, product},
    template: 'order-confirmation',
  });

  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const {id: userId} = ctx.user;
  const orders = await Order.find({user: userId}).populate('product');
  ctx.body = {orders: orders.map(mapOrder)};
};
