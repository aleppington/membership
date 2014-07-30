var Registration = require("../lib/registration");
var UserRespositry = require("../lib/userRepositry");

describe("Registration", function(){
    // happy path
    var registration;

    before(function(done){
        var registrationArgs = {
            userRepositry : new UserRespositry({
                users : []
            })
        };
        registration = new Registration(registrationArgs);
        done();
    });

    describe("a valid application", function(){
        var regResult = {};
        before(function(done){
            registration.applyForMembership({
                email : "test@quantiv.com",
                password : "test$password",
                confirm : "test$password"
                }, function(err, result) {
                    regResult = result;
                    done();
                });
        });
        it("is successful", function(){
            regResult.success.should.equal(true);
        });
        it("creates a user", function(){
            regResult.user.should.be.defined;
        });
        it("creates a log entry",function(){
            regResult.log.should.be.defined;
        });
        it("sets the user's status to approved",function(){
            regResult.user.status.should.be.equal("approved");
        });
        it("offers a welcome message",function(){
            regResult.message.should.be.equal("Welcome!");
        });
        it("sets the user's sign in count to be 1", function(){
            regResult.user.signInCount.should.be.equal(1);
        });


    });
    describe("an empty or null email", function() {
        it("is not successful");
        it("tells user that email is required");


    });
    describe("empty or null password", function(){
        it("is not successful");
        it("tells user that password is required");
    });
    describe("password and confirm mismatch", function(){
        it("is not successful");
    });
    describe("email already exists", function(){

    });
});