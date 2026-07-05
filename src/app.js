

// external packages
require('express-async-errors'); // to replace try/catch this line
// handles errors automatically and wraps everything automatically
// so there's no need for try/catch block
const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const compression = require('compression');


// local modules
const { isLoggedIn, isAdmin } = require('./middlewares/role');
const basicLimiter = require('./middlewares/ratelimit');
const sessionMiddleware = require('./middlewares/session');
const { errorHandler } = require('./middlewares/errors/errorHandler');

const passportLocal = require('./config/passport/local');
const passportGoogle = require('./config/passport/google');


// routes
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/password');
const verificationRoutes = require('./routes/verification');
const productRoutes = require('./routes/product');
const paymentRoutes = require('./routes/payment');
const accountRoutes = require('./routes/account');
const adminRoutes = require('./routes/admin');


// creating app instance
const app = express();


// overall health check - before anything to prevent 
// ratelimits and auth middlewares being applied to it
app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'ok',
		uptime: process.uptime(),
		timestamp: Date.now()
	});
});


/* * enable this if you are using view engines in this 
  * case EJS - one template engine available in the market
*/
// app.set('view engine', 'ejs');
// app.set('views', 'src/views');

// to enable caching enable this
// app.set('view cache', true);


// for webhook only - raw body should be passed 
// before paresed by express
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));


// built-in / express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// to serve static files like HTML pages,
// images, videos etc... and cache them for 7-days to 
// improve performance
app.use(express.static(process.env.STATIC_DIR, { maxAge: '7d' }));


// to compress response - enable this line
// app.use(compression());

// to parse cookies
app.use(cookieParser());

app.use(sessionMiddleware);


// if using FLASH for error & success notification
// enable the flash setup code below

// app.use(flash());
// app.use((req, res, next) => {
	// res.locals.error = req.flash('error');
	// res.locals.errors = req.flash('errors');
	// res.locals.success = req.flash('success');
	// next();
// });


// passport registration
passportLocal(passport);
passportGoogle(passport);


// initializing passport
app.use(passport.initialize());
app.use(passport.session());


// Rate limiter middleware usage
app.use('/', basicLimiter);


// Using all routes
app.use('/auth', authRoutes);
app.use('/password', passwordRoutes);
app.use('/api/verify', verificationRoutes);
app.use('/shop', isLoggedIn, productRoutes);
app.use('/api/payment', isLoggedIn, paymentRoutes);
app.use('/account', isLoggedIn, accountRoutes);
app.use('/admin', isLoggedIn, isAdmin, adminRoutes);


// homepage mocking
app.get('/', isLoggedIn, (req, res) => {
	res.send("Welcome to homepage!");
});


// error handler middlewares
app.use('*', (req, res) => {
	res.status(404).json({
		success: false,
		message: 'Page not found'
	});
});



// the overall error handler
app.use(errorHandler);


// export app to handle server listen on server.js
module.exports = app;
