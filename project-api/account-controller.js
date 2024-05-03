import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:27017/project')

const UserRequest = mongoose.model('UserRequest', {
	fname: String,
	mname: String,
	lname: String,
	snumber: String,
	usertype: String,
	email: String,
	password: String, //very secure!
	applications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Application'}], //idk lol
	adviser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    approved: Boolean
});

const User = mongoose.model('User');

const getUserRequests = async (req, res) => {
	const userRequests = await UserRequest.find({});
	res.send(userRequests);
}

const getUserBySNum = async (req, res) => {
	const userRequest = await UserRequest.findOne({ snumber: req.query.snum })
	res.send(userRequest);
}

const addUserRequest = async (req, res) => {
	const { fname, mname, lname, snumber, usertype, email, password } = req.body

	const newUserRequest = new UserRequest({ fname, mname, lname, snumber, usertype, email, password, applications:[], adviser:null, approved:null })

	//check if email was already used
	const existing_email = await User.findOne({email: email});
	const existing_email_request = await UserRequest.findOne({email: email});
	
	if (existing_email || existing_email_request)
	{
		res.send({success: false, message: "Email already exists."});
		return
	}

	//check if student number was already used
	const existing_snumber = await User.findOne({snumber: snumber});
	const existing_snumber_request = await UserRequest.findOne({snumber: snumber});
	if (existing_snumber || existing_snumber_request)
	{
		res.send({success: false, message: "Student number already exists."});
		return
	}

	const result = await newUserRequest.save()

	if (result._id) {
		res.send({ success: true })
	} else {
		res.send({ success: false, message: "Failed to save user." })
	}
}

//add edit functionality later on
//
//-------------------------------

//deletes using user id
const deleteUserRequest = async (req, res) => {
	const { _id } = req.body

	const result = await UserRequest.deleteOne({ _id })

	if (result.deletedCount == 1) {
		res.send({ success: true })
	} else { 
		res.send({ success: false })
	}
}

export { getUserRequests,getUserBySNum, addUserRequest, deleteUserRequest };