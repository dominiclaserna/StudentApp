import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:27017/project')

const User = mongoose.model('User');

const getUsers = async (req, res) => {
	const users = await User.find({});
	res.send(users)
}

const getStudents = async (req, res) => {
	const students = await User.find({usertype: "student"})
	res.send(students)
}

const getApprovers = async (req, res) => {
	const approvers = await User.find({usertype: "approver"})
	res.send(approvers)
}

const getApproverByName = async (req, res) => {
	const { fname, mname, lname } = req.body
	var conditions = {usertype: "approver"}
	if (fname) {
		conditions.fname = fname;
	}

	if (mname) {
		conditions.mname = mname;
	}

	if (lname) {
		conditions.lname = lname;
	}

	const approver = await User.find(conditions)
	res.send(approver)
}

const getUserById = async (req, res) => {
	const { _id } = req.body
	const user = await User.findOne({ _id })

	if (user) {
		res.send(user)
	} else {
		res.send({ success: false })
	}
}

const addUser = async (req, res) => {
	const { fname, mname, lname, snumber, usertype, email, password } = req.body
	const newUser = new User({ fname, mname, lname, snumber, usertype, email, password, applications:[], adviser:null })
	
	const result = await newUser.save()

	if (result._id) {
		res.send({ success: true })
	} else {
		res.send({ success: false })
	}
}

const updateApprover = async (req, res) => {
	const { _id, fname, mname, lname, snumber, email} = req.body
	const updateUser = await User.findOneAndUpdate({ _id: _id }, {fname: fname, mname: mname, lname: lname, snumber: snumber, email: email},{ useFindAndModify: false, new: true })
	
	if (updateUser) {
		res.send({ success: true })
	} else {
		res.send({ success: false })
	}
}
//add edit functionality later on
//
//-------------------------------

//deletes using user id
const deleteUser = async (req, res) => {
	const { _id } = req.body
	const result = await User.deleteOne({ _id: _id })

	if (result.deletedCount == 1) {
		res.send({ success: true })
	} else { 
		res.send({ success: false })
	}
}

const assignAdviser = async (req, res) => {
	const { adviser, student } = req.body
	const updateAdviser = await User.updateOne({ _id: student }, { adviser: adviser })
	if (updateAdviser) {res.send({success: true})}
	else {res.send({success: false})}
}

export { getUsers, addUser, deleteUser, getUserById, getApprovers, getApproverByName, getStudents, assignAdviser, updateApprover };