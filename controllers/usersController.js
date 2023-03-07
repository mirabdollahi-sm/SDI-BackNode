const User = require('../model/User');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const addUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({'message': 'Username and password are required!'})
    //check for duplicate username
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409);
    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });
        
        console.log(result);

        res.status(201).json({ 'success': `New user ${user} created!`})
    } catch(err) {
        res.status(500).json({ 'message': err.message })
    } 
}

const editUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const newUsername = req.body.user;
    const newPwd = req.body.pwd;
    console.log(user);
    if ( user.username !== newUsername ) {
        const duplicate = await User.findOne({ username: newUsername }).exec();
        if (duplicate) return res.sendStatus(409);
    }
    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(newPwd, 10);
        //edit and save user new information
        user.username = newUsername;
        user.password = hashedPwd;
        const result = await user.save();
        console.log(result);
        res.status(201).json({ 'success': `user ${newUsername} edited!`})
    } catch(err) {
        res.status(500).json({ 'message': err.message })
    }
}

const deleteUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.params.id });
    res.json(result);
}


const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
}

module.exports = {
    getAllUsers,
    addUser,
    deleteUser,
    editUser,
    getUser
}