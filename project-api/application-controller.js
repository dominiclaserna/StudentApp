import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:27017/project')

const Application = mongoose.model('Application', {
	status: String,
	step: Number,
	remarks: [{
		remark: String,
		date: Date,
		commenter: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		stepgiven: Number
	}],
	studentsubmission: {
		link: String,
		date: Date,
		stepgiven: Number
	},
	userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const User = mongoose.model('User');

const getApplications = async (req, res) => {
	const applications = await Application.find({});
	res.send(applications)
}

const getOpenApplications = async (req, res) => {
	const applications = await Application.find({    
		$or: [
		{ status: "open" },
		{ status: "pending" }
	  ]})
	res.send(applications)
}

const getUserApplications = async (req, res) => {
	const { userId } = req.body
	const applications = await Application.find({userId: userId})
	res.send(applications)
}

const getOpenApplication = async (req, res) => {
	const { userId } = req.body
	const application = await Application.find({userId: userId, $or: [{ status: "open" }, { status: "pending" }]});
	res.send(application)
}

const getApplicationByID = async (req, res) => {
	const application = await Application.findOne({ _id: req.query.id})
	res.send(application);
}
 
const addApplication = async (req, res) => {
	const { status, step, remarks, studentsubmission, userId } = req.body
	const newApplication = new Application({ status, step, remarks, studentsubmission, userId: userId})
	const updateUser = await User.updateOne({ _id: userId }, { $push: { applications: newApplication._id } })


	const result = await newApplication.save()

	if (result._id && updateUser) {
		res.send({ success: true })
	} else {
		res.send({ success: false })
	}
}

const closeApplication = async (req, res) => {
	const { _id } = req.body

	const updateApplication = await Application.findOneAndUpdate({ _id: _id }, {status:"closed"},{ useFindAndModify: false, new: true })

	//useFindAndModify:false
	if (updateApplication) {
		res.send({ success: true })
	} else {
		res.send({ success: false })
	}
}

//might be edit to closed status instead, for now just delete it
const deleteApplication = async (req, res) => {
	const { _id } = req.body

	const result = await Application.deleteOne({ _id })

	if (result.deletedCount == 1) {
		res.send({ success: true })
	} else { 
		res.send({ success: false })
	}
}

const approveApplication = async (req, res) => {
	const { _id, step } = req.body
	const updateApplication = await Application.findOneAndUpdate({ _id: _id }, {step: step},{ useFindAndModify: false, new: true })
	
	if (updateApplication) {
		res.send({ success: true })
	} else {
		res.send({ success: false })
	}
}

const returnApplication = async (req, res) => {
	const { _id, step, remark } = req.body

	const updateApplication = await Application.findOneAndUpdate({ _id: _id }, {step: step, status: "pending", $push: { remarks: remark }},{ useFindAndModify: false, new: true })
	
	if (updateApplication) {
		res.send({ success: true })
	} else {
		res.send({ success: false })
	}
}

const resubmitApplication = async (req, res) => {
	const { _id, remark, studentsubmission } = req.body
	const updateApplication = await Application.findOneAndUpdate({ _id: _id }, {status: "open", $push: {remarks: remark}, studentsubmission: studentsubmission}, { useFindAndModify: false, new: true })

	if (updateApplication) {
		res.send({ success: true })
	} else {
		res.send({ success: false })
	}
}

const getAllApplicationsByStep = async (req, res) => {
	const { step } = req.body
	const applications = await Application.find({step: step})
	res.send(applications)
}

const getAllApplicationsByStatus = async (req, res) => {
	const { status } = req.body
	const applications = await Application.find({status: status})
	res.send(applications)
}

const clearApplication = async (req, res) => {
	const { _id } = req.body
	const updateApplication = await Application.findOneAndUpdate({ _id: _id }, {status: "cleared", step: 4},{ useFindAndModify: false, new: true })
	
	if (updateApplication) {
		res.send({ success: true })
	} else {
		res.send({ success: false })
	}
}

const getClearanceDetails = async (req, res) => {
	//application id!
	const { _id } = req.body
	const application = await Application.findOne({_id : _id})
	const student = await User.findOne({_id: application.userId})
	const adviser = await User.findOne({_id: student.adviser})
	const admin = await User.findOne({usertype: 'superuser'})


	var details = {
		studentName: student.fname + " " + student.mname + " " + student.lname,
		studentNumber: student.snumber,
		adviserName: adviser != null ? adviser.fname + " " + adviser.mname + " " + adviser.lname : "No adviser",
		adminName: admin.fname + " " + admin.mname + " " + admin.lname,
	}

	res.send(details)
}
export { getApplications,getOpenApplications, addApplication, deleteApplication, getApplicationByID, getOpenApplication, getUserApplications, closeApplication, approveApplication, returnApplication, resubmitApplication, getAllApplicationsByStep, getAllApplicationsByStatus, clearApplication, getClearanceDetails };