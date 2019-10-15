const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  const result = categories
      .map(({id, title, subcategories}) => {
        subcategories = subcategories.map(({id, title}) => ({id, title}));
        return ({id, title, subcategories});
      });

  ctx.body = {categories: result};
};

module.exports.categoryAdd = async function categoryAdd(ctx, next) {
  const category = await Category.create({
    title: 'Category2',
    subcategories: [{
      title: 'Subcategory2',
    }],
  });

  ctx.body = category;
};
