module.exports = function(app, router, Client, Domain, Hosting) {

  // check if user is logged in before proceding
  router.all("/clients*", isLoggedIn);
  
  router.get("/", function(req,res) {
    res.redirect("/clients");
  });

  // Shows all clients
  router.get("/clients", function(req, res) {
    Client.find().populate("domains").exec(function(err, clients) {
      res.render("clients/index", {
        clients: clients,
        messageError: req.flash('error'),
        messageInfo: req.flash('info')
      });
    });
  });

  /**
   * Renders addclient page
   */
  router.get("/clients/addclient", function(req, res) {
    res.render("clients/addclient");
  });

  /**
   * Adds client
   */
  router.post("/clients/addclient", function(req, res) {
    var client = new Client({
      'email': req.body.email,
      'name': req.body.name,
      'nick': req.body.nick
    });

    client.save(function(err) {
      if (err) {
        if (err) {req.flash("error", err);}
        var message = [];
        for (var error in err.errors) {
          message.push(capitalize(err.errors[error].message));
        }
        if (message.length < 1 && err.code === 11000) {
          req.flash('error', "This client is already in our database.");
        } else {
          req.flash('error', message);
        }
        res.redirect('/clients/addclient');
      } else {
        req.flash('info', "Client added succesfully!");
        res.redirect('/');
      }

    });
  });

  /**
   * Displays single client details
   */
  router.get("/clients/:client_id", function(req, res) {
    Client.findById(req.params.client_id).populate("domains hosting").exec(function(err, client) {
      if (err) { req.flash("error", err);}
      res.render("clients/details", { client: client,messageError: req.flash('error'), messageInfo: req.flash('info')});
    });

  });

  /**
   * Adds domain
   */
  router.post("/clients/:client_id/adddomain", function(req, res) {
    Client.findById(req.params.client_id, function(err, client) {

      var domain = new Domain({
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        realPrice: req.body.realPrice,
        billedPrice: req.body.billedPrice
      });

      domain.save(function(err, dom) {
        if (err) {
          req.flash("error", err);
        }
        client.domains.push(dom._id);
        client.save(function(err) {
          if (err) {
            req.flash("error", err);
          }
          if (err) {req.flash("error", err);}
        });
      });
      req.flash("info","Domain added successfully!");
      res.redirect("/clients/" + client._id);
    });
  });

  /** Removes domain from db and ref array */
  router.delete("/clients/:client_id/domains/:domain_id", function(req,res) {
    
    Client.findById(req.params.client_id).populate("domains").exec(function(err, client) {
      if (err) {req.flash("error", err);}
      Domain.findOne({_id: req.params.domain_id}, function(err,dom) {
        if (err) {req.flash("error", err);}
        dom.remove();
        client.domains.remove({_id: req.params.domain_id});
        client.save(function(err) {
          if (err) {req.flash("error", err);}
        });
      });
      req.flash("info","Domain removed successfully!");
      res.redirect("/clients/" + client._id);
    });

  });

  /**
   * Adds hosting
   */
  router.post("/clients/:client_id/addhosting", function(req, res) {
    Client.findById(req.params.client_id, function(err, client) {
      if (err) {req.flash("error", err);}
      var hosting = new Hosting({
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        billedPrice: req.body.billedPrice
      });

      hosting.save(function(err, dom) {
        if (err) {
          req.flash("error", err);
        }
        client.hosting.push(dom._id);
        client.save(function(err) {
          if (err) {
            req.flash("error", err);
          }
        });
      });
      req.flash("info", "Hosting added successfully.");
      res.redirect("/clients/" + client._id);
    });
  });

  /** Removes hosting from db and ref array */
  router.delete("/clients/:client_id/hosting/:hosting_id", function(req,res) {
    
    Client.findById(req.params.client_id).populate("hosting").exec(function(err, client) {
      Hosting.findOne({_id: req.params.hosting_id}, function(err,hosting) {
        if (err) {req.flash("error", err);}
        hosting.remove(function(err) {
          if (err) {req.flash("error", err);}
        });
        client.hosting.remove({_id: req.params.hosting_id});
        client.save(function(err) {
          if (err) {req.flash("error", err);}
        });
        if (err) {req.flash("error", err);}
      });
      req.flash("info", "Hosting removed successfully.");
      res.redirect("/clients/" + client._id);
    });
  });


  app.use("/", router);
  
};

//////////////////////
// helper functions //
//////////////////////
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', "You have to login");
  res.redirect("/login");
}