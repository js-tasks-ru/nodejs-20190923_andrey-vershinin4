const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.request.query;

  if (!subcategory) {
    return next();
  }

  if (!mongoose.Types.ObjectId.isValid(subcategory)) {
    ctx.throw(400, 'невалидный id');
  }

  const products = await Product.find({subcategory});
  products.forEach((p) => p.id = p._id);

  const result = products
      .map(({
        id,
        images,
        price,
        category,
        subcategory,
        title,
        description,
      }) => ({
        id,
        images,
        price,
        category,
        subcategory,
        title,
        description,
      }));
  ctx.body = {products: result};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.throw(400, 'невалидный id');
  }

  const product = await Product.findById(id);

  if (!product) {
    ctx.throw(404);
  }

  ctx.body = {product};
};

module.exports.productAdd = async function categoryAdd(ctx, next) {
  const productNum = Math.floor(Math.random() * 100000);
  const categories = await Category.find();
  const idx = Math.floor(Math.random() * categories.length);
  const category = categories[idx];

  const product = await Product.create({
    title: `product ${productNum}`,
    description: `description of product ${productNum}`,
    price: (productNum / 1000).toFixed(2),
    category: category._id,
    subcategory: category.subcategories[0]._id,
    images: new Array(idx + 2).fill(`image-${Math.random()}`),
  });

  ctx.body = product;
};
