const express = require('express');
const UserModel = require('../models/UserModel.js');

const UserRouter = express.Router();

// Middleware to parse JSON bodies
UserRouter.use(express.json());

// Routes
UserRouter
    .route('/')
    .get(getAllUsers)
    .post(postUser)
    .patch(updateUser)
    .delete(deleteUser);

UserRouter
    .route('/:id')
    .get(getUserById);

// Route Handlers
async function getAllUsers(req, res) {
    try {
        let allUsers = await UserModel.find();
        res.json({
            message: "List of all users",
            data: allUsers,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving users",
            error: err.message,
        });
    }
}

async function postUser(req, res) {
    try {
        let user = req.body;
        let data = await UserModel.create(user);
        res.json({
            message: "User created successfully",
            data: data,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error creating user",
            error: err.message,
        });
    }
}

async function updateUser(req, res) {
    try {
        const { filter, update } = req.body; // Expect filter and update objects in the body
        let data = await UserModel.updateOne(filter, update);
        res.json({
            message: "User updated successfully",
            data: data,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error updating user",
            error: err.message,
        });
    }
}

async function deleteUser(req, res) {
    try {
        let user = req.body;
        let data = await UserModel.deleteOne(user);
        res.json({
            message: "User deleted successfully",
            data: data,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error deleting user",
            error: err.message,
        });
    }
}

async function getUserById(req, res) {
    try {
        let data = await UserModel.findById(req.params.id);
        res.json({
            message: "User found",
            data: data,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving user",
            error: err.message,
        });
    }
}

module.exports = UserRouter;