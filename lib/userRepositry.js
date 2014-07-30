var _ = require("underscore");
var assert = require("assert");

var Repositry = function(args){

    var users = args.users;
    if (!users){
        users = [];
    }

    var getUserInternal = function(args, callback){
       var user = _.findWhere(users, args);
       if (user){
           callback(null, user);
       }
       else
       {
          callback(null, null);
       }
    };

    var saveUserInternal = function(args, callback){
        if (args.data){
            args.data["id"] = users.length + 1;
            users.push(args.data);
            getUserInternal({ email : args.data.email }, function(err, user){
                assert.ok(err === null, err);
                if (user){
                    callback(null, user);
                }
                else
                {
                    var error = {
                        message : "Could not save user"
                    };
                    callback(error, null);
                }
            });
        }
    };

    var repositry = {
        get : getUserInternal,
        save : saveUserInternal
    };
    return repositry;
};

module.exports = Repositry;

