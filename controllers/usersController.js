const bcrypt = require("bcrypt");
const pool = require("../config/dbConn");
const queries = require("./queries/userQueries");

const getAllUsers = (req, res) => {
  pool.query(queries.selectAllUsers(), (err, queryRes) => {
    if (err) return console.log(err);
    const users = queryRes;
    if (!users.length)
      return res.status(204).json({ message: "No users found" });
    res.json(users);
  });
};

const addUser = async (req, res) => {
  const { user, pwd, admin } = req.body;
  const role = admin === true ? "admin" : "user";
  // Checking req for both username and password
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required!" });
  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    pool.query(queries.addUser(user, hashedPwd, role), (err, queryRes) => {
      if (err?.errno === 1062) {
        console.log(`Username ${user} already existed!.`);
        return res.sendStatus(409);
      }
      const result = {
        username: user,
        password: hashedPwd,
      };
      console.log(result);
      res.status(201).json({ success: `New user ${user} created!` });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editUser = async (req, res) => {
  // check request for id
  if (!req?.body?.id)
    return res.status(400).json({ message: "User ID required" });
  try {
    // get request info
    const newUsername = req.body.user;
    const newPwd = req.body.pwd;
    const id = req.body.id;
    const admin = req.body.admin;
    console.log(admin);
    const role = admin === true ? "admin" : "user";
    // encrypt the password
    const hashedPwd = await bcrypt.hash(newPwd, 10);
    //edit and save user new information
    pool.query(
      queries.updateUser(newUsername, hashedPwd, role, id),
      (err, queryRes) => {
        // check if new username was duplicate
        if (err?.errno === 1062) {
          console.log(`Username ${newUsername} already existed!.`);
          return res.sendStatus(409);
        }
        // if any other error happen
        if (err) console.log(err);
        const result = {
          username: newUsername,
          password: newPwd,
        };
        // if there was no such user
        if (queryRes?.affectedRows === 0) {
          return res
            .status(204)
            .json({ message: `No user with id ${id} found!` });
        }
        // everything works right
        console.log(result);
        res
          .status(201)
          .json({ success: `User ${newUsername} Successfuly Edited!` });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  // check request for id
  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID required" });
  // get request info
  const id = req.params.id;
  pool.query(queries.deleteUser(id), (err, queryRes) => {
    // check for error
    if (err) console.log(err);
    // if there was no such user
    if (queryRes?.affectedRows === 0) {
      return res.status(204).json({ message: `No user with id ${id} found!` });
    }
    // everything works right
    res
      .status(201)
      .json({ success: `User with id ${id} successfully deleted` });
  });
};

const getUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID required" });
  const id = req.params.id;
  pool.query(queries.selectById(id), (err, queryRes) => {
    if (err) return console.log(err);
    const user = queryRes;
    if (!user.length)
      return res.status(204).json({ message: "No user with this found" });
    res.json(user);
  });
};

module.exports = {
  getAllUsers,
  addUser,
  deleteUser,
  editUser,
  getUser,
};
