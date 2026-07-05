

// external packages
const router = require('express').Router();

// import custom packages
const adminController = require('../controllers/admin');
const upload = require('../config/storage/multer');
const adminValidator = require('../middlewares/validator/admin');
const handleValidationErrors = require('../middlewares/errors/handleValidationErrors');
const abortSignal = require('../middlewares/abort');

// important env variable
const imageLimit = parseInt(process.env.MAX_IMAGE_LIMIT);


// ROUTERS
router.get('/dashboard',
	abortSignal,
	adminController.dashboard
);

router.post('/create',
	upload.array('images', imageLimit),
	...adminValidator.createProduct,
	handleValidationErrors,
	adminController.createProduct
);

router.get('/products',
	abortSignal,
	...adminValidator.getAllProducts,
	handleValidationErrors,
	adminController.getAllProducts
);

router.get('/products/:id',
	...adminValidator.getOneProduct,
	handleValidationErrors,
	adminController.getOneProduct
);

router.get('/orders',
	abortSignal,
	...adminValidator.getAllOrders,
	handleValidationErrors,
	adminController.getAllOrders
);

router.patch('/products/:id',
	upload.array('images', imageLimit),
	...adminValidator.updateProduct,
	handleValidationErrors,
	adminController.updateProduct
);

router.delete('/products/:id',
	...adminValidator.deleteProduct,
	handleValidationErrors,
	adminController.deleteProduct
);



// finally export the configured router
module.exports = router;
