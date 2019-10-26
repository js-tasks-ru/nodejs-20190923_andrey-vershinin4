const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');
const mapOrderConfirmation = require('../mappers/orderConfirmation');

module.exports.checkout = async function checkout(ctx, next) {
  const {product: productId, phone, address} = ctx.request.body;

  // create order
  const order = new Order({
    user: ctx.user,
    product: productId,
    phone,
    address,
  });

  await order.save();

  // find product
  const product = await Product.findById(productId);

  // send order-confirmation
  await sendMail({
    to: ctx.user.email,
    subject: 'Подтверждение создания заказа',
    locals: mapOrderConfirmation(order, product),
    template: 'order-confirmation',
  });

  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user}).populate('product');
  ctx.body = {orders: orders.map(mapOrder)};
};
