module.exports = function(app,router,passport, User) {



	///////////
	// GET / //
	///////////
	router.get("/", isLoggedIn, function(req,res) {
		User.find(function(err,users) {
			if (err) {return err}
			res.render("index", {users: users, messageError: req.flash('error'), messageInfo: req.flash('info')});
		});
	});

	/////////////////
	// GET /adduser //
	/////////////////
	router.get('/adduser', isLoggedIn, function(req,res) {
		res.render('adduser', {messageError: req.flash('error'), messageInfo: req.flash('info')});
	});

	//////////////////
	// POST /adduser //
	//////////////////
	router.post('/adduser', function(req,res) {
		var user = new User({
			'email': req.body.email,
			'password': req.body.password
		});

		user.save(function(err) {
			if (err) {
				var message = [];
				for (var error in err.errors) {
					message.push(capitalize(err.errors[error].message));
				}
				if (message.length < 1 && err.code === 11000) {
					req.flash('error', "This email is already in our database.");
				} else {
					req.flash('error', message);
				}
				res.redirect('/adduser');
			} else {
				req.flash('info', "User created succesfully!");
				res.redirect('/');
			}
			
		});	

	});

	////////////////
	// GET /login //
	////////////////
	router.get("/login", function(req,res) {
		res.render('login', {messageError: req.flash('error'), messageInfo: req.flash('info')});
	});

	router.post("/login",passport.authenticate('local-login',{ successRedirect: '/',
													                                   failureRedirect: '/login',
													                                   failureFlash: true }));

	router.get("/logout", isLoggedIn, function(req,res) {
		req.logout();
		 res.redirect('/login');
	});



	app.use("/",router);
};

//////////////////////
// helper functions //
//////////////////////

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function isLoggedIn(req,res,next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', "You have to login");
	res.redirect("/login");
}
