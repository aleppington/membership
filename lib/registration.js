var User = require("../models/user");
var Application = require("../models/application");
var assert = require("assert");
var Log = require("../models/log");

var RegResult = function() {
    var result = {
        success : false,
        message : null,
        user : null
    };
    return result;
}

var Registration = function(args) {
    var self = this;
    var userRepositry = args.userRepositry;

    var validateInputs = function (app) {
        if (!app.email || !app.password) {
            app.setInvalid("Email and password are required");
        } else if (app.password !== app.confirm) {
            app.setInvalid("Passwords don't match");
        } else {
            app.validate();
        }
    };

    var checkIfUserExists = function (app, next) {
        if (userRepositry.get({email: app.email}, function (err, user) {
            assert.ok(err === null, err);
            if (user) {
                app.setInvalid("Email already exists");
                next(null, true);
            }
            else
            {
                next(null, false);
            }
        }));
    };

    var saveUser = function (user, next) {
        if (userRepositry.save({
            data : user
        }, function (err, result) {
            assert.ok(err === null, err);
            next(null, result);
        }));
    };

    var addLogEntry = function(user, next) {
        var log = new Log({
            subject : "Registration",
            userId : user.id,
            entry : "Successfully Registered"
        });
        next(null, log);
    };

    self.applyForMembership = function (args, next) {
        var regResult = new RegResult();
        var app = new Application(args);

        validateInputs(app);
        checkIfUserExists(app, function (err, exists) {
            assert.ok(err === null, err);
            if (!exists) {
                var user = new User(app);
                user.status = "approved";
                user.signInCount = 1;
                //hash the password

                //save the user
                saveUser(user, function(err, newUser){
                    assert.ok(err === null, err);
                    regResult.user = newUser;
                    // add the log entry
                    addLogEntry(newUser, function(err,newLog){
                        regResult.log = newLog;
                        regResult.success = true;
                        regResult.message = "Welcome!";
                        next(null, regResult);
                    });

                });


            }
        });

    };

    return self;
};

module.exports = Registration;

