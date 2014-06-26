module.exports = function(app,router,passport, User) {

	// checks if user is logged in before proceding
	app.use("/users*", isLoggedIn);

	/////////////////
	// GET /adduser //
	/////////////////
	router.get('/users',  function(req,res) {
		User.find(function(err,users) {
			if (err) {req.flash("error", err)}
			res.render("users/index", {users: users, messageError: req.flash('error'), messageInfo: req.flash('info')});
		});
	});

	//////////////////
	// POST /adduser //
	//////////////////
	router.post('/users/adduser', function(req,res) {
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
				res.redirect('/users');
			} else {
				req.flash('info', "User created succesfully!");
				res.redirect('/users');
			}
			
		});	

	});

	//////////////////
	// DELETE user //
	//////////////////
	router.delete("/users/remove/:user_id",function(req,res) {
		User.remove({_id: req.params.user_id}, function(err) {
			if (err) {
				req.flash('error',err);
				res.redirect("/users");
			} 
			else {
				req.flash('info', "successfully deleted.");
				res.redirect("/users");
			}
		});
	});

	////////////////
	// GET /login //
	////////////////
	router.get("/login", function(req,res) {
		res.render('login', {messageError: req.flash('error'), messageInfo: req.flash('info')});
	});

	router.post("/login",passport.authenticate('local-login',{ successRedirect: '/clients',
													                                   failureRedirect: '/login',
													                                   failureFlash: true }));

	router.get("/logout",  function(req,res) {
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
