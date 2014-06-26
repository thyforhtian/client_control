var mongoose = require('mongoose');
var mongooseHistory = require('mongoose-history');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	email: {type: String, required: '{PATH} is required!', unique: 'This email already exists!'},
	password: {type: String, required: '{PATH} is required!'}
});

	UserSchema.path('email').email("Email format is invalid");
	UserSchema.path('password').length(6,30,"Password length should be between 6-30");

	UserSchema.pre('save', function(next) {
		this.password = bcrypt.hashSync(this.password);
	next();
});

UserSchema.methods.validPassword = function(pass) {
	return bcrypt.compareSync(pass,this.password);
};
UserSchema.plugin(mongooseHistory);

var User = mongoose.model("User", UserSchema);
module.exports = User;