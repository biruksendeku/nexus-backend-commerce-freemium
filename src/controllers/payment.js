

// import packages
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const withAbortCheck = require('../utils/helpers/abortCheck');
const { BadRequestError, NotFoundError, AppError } = require('../middlewares/errors/customErrors');



/* ===================================================
   ===================================================
                   * CREATE-PAYMENT
   ===================================================
   =================================================== */
exports.createPayment = async (req, res) => {
  const guard = withAbortCheck(req);

  const { items, shippingAddress } = req.body;
  const userId = req.user?._id;

  if (!userId) throw new AppError('User not authenticated', 401);
  if (!items || !Array.isArray(items) || items.length === 0) throw new BadRequestError('Cart is empty');

  guard.check();

  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId).exec({ signal: req.signal });
    if (!product) throw new NotFoundError(`Product ${item.productId}`);
    if (product.status === 'out of stock') throw new BadRequestError(`${product.name} is out of stock`);
    if (product.quantity < item.quantity) throw new BadRequestError(`Only ${product.quantity} units of ${product.name} available`);

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.images[0] || ''
    });
  }

  const shippingCost = 0;
  const tax = Math.round(subtotal * Number(process.env.TAX_PERCENT)) / 100;
  const total = subtotal + shippingCost + tax;

  const order = new Order({
    user: userId,
    items: orderItems,
    subtotal,
    shippingCost,
    tax,
    total,
    shippingAddress: shippingAddress || {},
    orderStatus: 'pending',
    paymentStatus: 'pending'
  });
  await order.save();

  guard.check();

  // Return a simulated payment URL (frontend can redirect to a demo page)
  res.status(200).json({
    success: true,
    sessionId: null,
    url: `${process.env.BASE_URL}/payment/simulate?orderId=${order._id}`,
    orderId: order._id
  });
};



/* ===================================================
   ===================================================
                   * POST-WEBHOOK
   ===================================================
   =================================================== */
exports.webhookController = async (req, res) => {
  res.status(200).json({ received: true });
};
