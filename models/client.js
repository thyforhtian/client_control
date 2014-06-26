var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
	email: {type: String, required: '{PATH} is required!', unique: 'This email already exists!'},
	name: String,
	nick: String,
	domains: [{ type: Schema.Types.ObjectId, ref: 'Domain' }],
	hosting: [{ type: Schema.Types.ObjectId, ref: 'Hosting'}]
});

var DomainSchema = new Schema({
	name: {type: String, required: '{PATH} is required'},
	startDate: {type: Date, required: '{PATH} is required'},
	endDate: {type: Date, required: '{PATH} is required'},
	realPrice: {type: Number, required: '{PATH} is required'},
	billedPrice: {type: Number, required: '{PATH} is required'}
});

var HostingSchema = new Schema({
	name: {type: String, required: '{PATH} is required'},
	startDate: {type: Date, required: '{PATH} is required'},
	endDate: {type: Date, required: '{PATH} is required'},
	billedPrice: {type: Number, required: '{PATH} is required'}
});

var Domain = mongoose.model("Domain", DomainSchema);
var Hosting = mongoose.model("Hosting", HostingSchema);
var Client = mongoose.model("Client", ClientSchema);

module.exports = {
	Client: Client,
	Domain: Domain,
	Hosting: Hosting
}