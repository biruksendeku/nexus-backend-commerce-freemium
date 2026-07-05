


// to check if the user has active session / is logged in?
exports.isLoggedIn = (req, res, next) => {
	if(!req.isAuthenticated()) {
		// if not redirect to where they can login
		return res.redirect('/auth/login');
	}

	// you could also check filter out unverified users
	// from accessing any routes by simply using 'isVerified'
	
	// if logged in call next
	next();
};



// check if the user is admin or not
exports.isAdmin = (req, res, next) => {
	if(req.user.userRole === 'admin') {
		return next();
	}
	res.status(403).send('Forbidden');
};
