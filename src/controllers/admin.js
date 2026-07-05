

// import packages
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const cloudinary = require('../config/storage/cloudinary');
const buildSort = require('../utils/query/buildSort');
const withAbortCheck = require('../utils/helpers/abortCheck');
const {
  NotFoundError,
  BadRequestError,
} = require('../middlewares/errors/customErrors');



/*
  ====================================================
  ====================================================
                   * DASHBOARD
  ====================================================
  ====================================================*/
exports.dashboard = async (req, res) => {
  const guard = withAbortCheck(req);

  // time boundaries
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  // fetch today + this month orders
  const [todayOrders, monthOrders, totalProducts, totalUsers] = await Promise.all([
    Order.find({ createdAt: { $gte: todayStart } }).lean().exec({ signal: req.signal }),
    Order.find({ createdAt: { $gte: monthStart } }).lean().exec({ signal: req.signal }),
    Product.countDocuments(),
    User.countDocuments(),
  ]);

  guard.check();

  // compute revenue (simple reduce)
  const todayCompleted = todayOrders.filter(o => o.status === 'completed');
  const todayRevenue = todayCompleted.reduce((sum, o) => sum + (o.total || 0), 0);
  const monthCompleted = monthOrders.filter(o => o.status === 'completed');
  const monthRevenue = monthCompleted.reduce((sum, o) => sum + (o.total || 0), 0);

  // send json response
  res.status(200).json({
    success: true,
    data: {
      today: {
        orders: todayOrders.length,
        completed: todayCompleted.length,
        revenue: todayRevenue,
      },
      thisMonth: {
        orders: monthOrders.length,
        completed: monthCompleted.length,
        revenue: monthRevenue,
      },
      totals: {
        products: totalProducts,
        users: totalUsers,
      },
    },
  });
};



/*
  ====================================================
  ====================================================
                   * GET ALL PRODUCTS
  ====================================================
  ====================================================*/
exports.getAllProducts = async (req, res) => {
  const guard = withAbortCheck(req);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = buildSort(req.query.sort);

  // check client connection before proceeding
  guard.check();

  const [products, totalProducts] = await Promise.all([
    Product.find()
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec({ signal: req.signal }),
    Product.countDocuments(),
  ]);

  // check client connection before response
  guard.check();

  // send json response
  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      totalItems: totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      hasNextPage: page < Math.ceil(totalProducts / limit),
      hasPrevPage: page > 1,
    },
  });
};



/*
  ====================================================
  ====================================================
                   * GET ONE PRODUCT
  ====================================================
  ====================================================*/
exports.getOneProduct = async (req, res) => {
  const guard = withAbortCheck(req);
  const product = await Product.findById(req.params.id).lean();

  if (!product) throw new NotFoundError('Product');

  guard.check();
  res.status(200).json({ success: true, data: product });
};



/*
  ====================================================
  ====================================================
                   * GET ALL ORDERS
  ====================================================
  ====================================================*/
exports.getAllOrders = async (req, res) => {
  const guard = withAbortCheck(req);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = buildSort(req.query.sort);

  // check client connection before proceeding
  guard.check();

  const [orders, totalOrders] = await Promise.all([
    Order.find()
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec({ signal: req.signal }),
    Order.countDocuments(),
  ]);

  // check client connection before response
  guard.check();

  // send json response
  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      totalItems: totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      hasNextPage: page < Math.ceil(totalOrders / limit),
      hasPrevPage: page > 1,
    },
  });
};



/*
  ====================================================
  ====================================================
                   * CREATE PRODUCT
  ====================================================
  ====================================================*/
exports.createProduct = async (req, res) => {
  const guard = withAbortCheck(req);
  const { name, price, quantity, category, deliveryTime, productInfo, status } = req.body;

  if (!name || !price || !quantity || !category || !deliveryTime || !productInfo || !status) {
    throw new BadRequestError('Missing required fields');
  }
  if (!req.files?.length) {
    throw new BadRequestError('At least one product image is required');
  }

  const uploadResults = await Promise.all(
    req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: process.env.CLOUDINARY_FOLDER_NAME, resource_type: 'image' },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          stream.end(file.buffer);
        })
    )
  );

  const newProduct = await Product.create({
    name,
    price: parseFloat(price),
    quantity: parseFloat(quantity),
    images: uploadResults.map((r) => ({ url: r.secure_url, public_id: r.public_id })),
    category,
    productInfo,
    deliveryTime,
    status: status || 'in stock',
  });

  // check client connection before result
  guard.check();

  // send json result
  res.status(201).json({ success: true, data: newProduct });
};



/*
  ====================================================
  ====================================================
                   * UPDATE PRODUCT
  ====================================================
  ====================================================*/
exports.updateProduct = async (req, res) => {
  const guard = withAbortCheck(req);
  const product = await Product.findById(req.params.id);
  if (!product) throw new NotFoundError('Product');

  const newImagesCount = req.files?.length || 0;
  const imagesToKeep = req.body.deleteImages?.length
    ? product.images.filter((img) => !req.body.deleteImages.includes(img.public_id))
    : product.images;

  if (imagesToKeep.length + newImagesCount > parseInt(process.env.MAX_IMAGE_LIMIT || 5)) {
    throw new BadRequestError(`Max ${process.env.MAX_IMAGE_LIMIT || 5} images allowed`);
  }

  let uploadedResults = [];

  // image validation
  try {
    if (req.files?.length) {
      uploadedResults = await Promise.all(
        req.files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: process.env.CLOUDINARY_FOLDER_NAME, resource_type: 'image' },
                (error, result) => (error ? reject(error) : resolve(result))
              );
              stream.end(file.buffer);
            })
        )
      );
    }

    if (req.body.deleteImages?.length) {
      await Promise.all(req.body.deleteImages.map((id) => cloudinary.uploader.destroy(id)));
    }

    product.images = imagesToKeep;
    if (uploadedResults.length) {
      product.images.push(...uploadedResults.map((r) => ({ url: r.secure_url, public_id: r.public_id })));
    }

    if (req.body.order?.length) {
      product.images.sort(
        (a, b) => req.body.order.indexOf(a.public_id) - req.body.order.indexOf(b.public_id)
      );
    }

    // save the product
    await product.save();

    // check client connection before result
    guard.check();

    // send json response
    res.status(200).json({ success: true, data: { id: product._id } });
  } catch (err) {
    await Promise.all(uploadedResults.map((r) => cloudinary.uploader.destroy(r.public_id)));
    throw err;
  }
};



/*
  ====================================================
  ====================================================
                   * DELETE PRODUCT
  ====================================================
  ====================================================*/
exports.deleteProduct = async (req, res) => {
  const guard = withAbortCheck(req);
  const product = await Product.findById(req.params.id);
  if (!product) throw new NotFoundError('Product');

  if (product.images?.length) {
    await Promise.all(product.images.map((img) => cloudinary.uploader.destroy(img.public_id)));
  }

  // update the product
  await Product.findByIdAndDelete(req.params.id);

  // check client connection before response
  guard.check();

  // send json response
  res.status(200).json({ success: true, data: null });
};
