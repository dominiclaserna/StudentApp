import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    mname: { type: String, required: true },
    lname: { type: String, required: true },
    snumber: { type: String, required: true },
    usertype: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    adviser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

UserSchema.pre("save", function(next) {
    const user = this;

    if (!user.isModified("password")) return next();

    return bcrypt.genSalt((saltError, salt) => {
        if (saltError) { return next(saltError); }
        return bcrypt.hash(user.password, salt, (hashError, hash) => {
            if (hashError) { return next(hashError); }
            user.password = hash;
            return next();
        });
    });
});

UserSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, callback);
}

mongoose.model("User", UserSchema);

const User = mongoose.model("User");

const signUp = async (req, res) => {
    const newUser = new User({
        fname: req.body.fname,
        mname: req.body.mname,
        lname: req.body.lname,
        snumber: req.body.snumber,
        usertype: req.body.usertype,
        email: req.body.email,
        password: req.body.password,
        applications: req.body.applications,
        adviser: req.body.adviser
    });

    const result = await newUser.save();

    if (result._id) {
          res.send({ success: true })
      } else {
          res.send({ success: false })
      }
}

const login = async (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password;

    // Check if email exists
    const user = await User.findOne({ email })

    //  Scenario 1: FAIL - User doesn't exist
    if (!user) {
        return res.send({ success: false })
    }

    // Check if password is correct using the Schema method defined in User Schema
    user.comparePassword(password, (err, isMatch) => {
    if (err || !isMatch) {
    // Scenario 2: FAIL - Wrong password
    return res.send({ success: false });
    }

    // Scenario 3: SUCCESS - time to create a token
    const tokenPayload = {
    _id: user._id
    }

    const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING");

    // return the token to the client
    return res.send({ success: true, usertype: user.usertype,token, user: user._id});
})
}

const addSuperUser = async(req,res) => {
    const checker = await User.findOne({usertype:'superuser'});
    if(!checker){
        const superuser = new User({
            fname: "John",
            mname: "Admin",
            lname: "Doe",
            snumber: "000",
            usertype: "superuser",
            email: "admin@superuser.com",
            password: "admin123",
        });
        superuser.save();
    }
}

const checkIfLoggedIn = async (req, res) => {

    if (!req.cookies || !req.cookies.authToken) {
        // FAIL Scenario 1 - No cookies / no authToken cookie sent
        return res.send({ isLoggedIn: false });
    }

    try {
        // try to verify the token
        const tokenPayload = jwt.verify(req.cookies.authToken, 'THIS_IS_A_SECRET_STRING');

        // check if the _id in the payload is an existing user id
        const user = await User.findById(tokenPayload._id)
        if (user) {
        // SUCCESS Scenario - User is found
        return res.send({ isLoggedIn: true })
        } else {
        // FAIL Scenario 2 - Token is valid but user id not found
        return res.send({ isLoggedIn: false })
        }
    } catch {
        // FAIL Scenario 3 - Error in validating token / Token is not valid
        return res.send({ isLoggedIn: false });
    }
}

export { signUp, login, checkIfLoggedIn,addSuperUser }