

// import packages
const LocalStrategy = require('passport-local').Strategy;

// our user model
const User = require('../../models/user');

// to compare password using bcryptjs
const comparePassword = require('../../utils/math/comparePassword');


// configuring local provider for Login and Signup using passwords
module.exports = function passportLocal(passport) {
	passport.use(new LocalStrategy(
		{
			// we choose email as our unique username-field
			usernameField: 'email',
			passwordField: 'password',
			// passing "req" object for "req.flash" usage purpose to display errors at ease
			passReqToCallback: true
		},
		async (req, email, password, done) => {
			try {
				// making sure the user provided both
				if(!email || !password) {
					req.flash('error', 'Missing credentials');
					return done(null, false);
				}
				// since it's Login we want to use Passport-Local for 
				// the user must exist
				const user = await User.findOne({ email });
				if(!user) {
					// it's because we are using for LOGIN only not for 
					// user registration
					req.flash('error', 'Email not registered');
					// passing false since req.flash handles the error display
					return done(null, false);
				}
				// lastUsed is to remind the user what they used last time and give them 
				// a choice to use the provider (Google, Facebook ) or Signup to 
				// setup password which is required to Login
				let lastUsed = user.authProvider[user.authProvider.length - 1];
				lastUsed.trim();
				lastUsed.charAt(0).toUpperCase() + lastUsed.slice(1).toLowerCase();
				if(user.password === null) {
					req.flash('error', `Signup or use your last Auth Provider ${lastUsed}`);
					return done(null, false);
				}
				// check password validity using bcrypt native method - compare
				const isValid = await comparePassword(password, user.password);
				if(!isValid) {
					req.flash('error', 'Incorrect email or password');
					return done(null, false);
				}
				done(null, user);
			} catch(err) {
				done(err);
			}
		}
	));

	// serialize using id to session
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	// deserialize user from the id
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id);
			done(null, user);
		} catch(err) {
			done(err);
		}
	});
};
