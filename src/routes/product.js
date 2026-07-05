

// import packages
const router = require('express').Router();

// import custom modules
const productController = require('../controllers/product');
const productValidator = require('../middlewares/validator/product');
const handleValidationErrors = require('../middlewares/errors/handleValidationErrors');
const abortSignal = require('../middlewares/abort');



// routes
router.get('/',
	abortSignal,
	...productValidator.products,
	handleValidationErrors,
	productController.products
);

router.post('/add-to-cart/:id',
	...productValidator.addToCart,
	handleValidationErrors,
	productController.addToCart
);

router.get('/cart',
	productController.cart
);

router.patch('/update-cart/:id',
	...productValidator.updateCart,
	handleValidationErrors,
	productController.updateCart
);

router.post('/remove-from-cart/:id',
	...productValidator.removeFromCart,
	handleValidationErrors,
	productController.removeFromCart
);

router.get('/orders',
	abortSignal,
	productController.orderHistory
);

router.get('/orders/:id',
	...productValidator.singleOrderHistory,
	handleValidationErrors,
	productController.singleOrderHistory
);

router.post('/add-to-wishlist/:id',
	...productValidator.addToWishlist,
	handleValidationErrors,
	productController.addToWishlist
);



// export the configure
module.exports = router;
