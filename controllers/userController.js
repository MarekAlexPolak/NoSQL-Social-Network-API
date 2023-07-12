const { User, Thought } = require("../models");

const userController = {
    getAllUser(req, res) {
        User.find({})
        .select("-__v")
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            res.status(500).json(err);
        });
    },
    
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: "thoughts",
            select: "-__v",
        })
        .select("-__v")
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: "No user found" });
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
    },
    
    createUser({ body }, res) {
        User.create(body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {res.status(500).json(err);})
    },
    
    updateUser({ params, body }, res) {
        User.findOneAndUpdate(
            { _id: params.id }, 
            body, 
            {   
                new: true, 
                runValidators: true,
            }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: "No user found" });
            }
            res.json(dbUserData);
        })
        .catch((err) => {res.status(500).json(err)})
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: "No user found" });
            }
            Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
            res.json({ message: "User and all thoughts deleted" });
        })
        .catch((err) => {res.status(500).json(err)});
    },
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { 
                new: true, 
                runValidators: true 
            }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: "No user found" });
            }
            res.json(dbUserData);
        })
        .catch((err) => {res.status(500).json(err)});
    },
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { 
                new: true,
                runValidators: true
            
            }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: "No user found" });
            }
            res.json(dbUserData);
        })
        .catch((err) => {res.status(500).json(err)});
    },
};

module.exports = userController;