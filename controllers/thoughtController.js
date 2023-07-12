const { User, Thought } = require("../models");

const thoughtController = {
    getAllThought(req, res) {
        Thought.find({})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {res.status(500).json(err);});
    },
    
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found' });
            }
            res.json(dbThoughtData);
        })
        .catch(err => {return res.status(500).json(err);});
    },

    createThought({ params, body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found' });
            }
            res.json(dbUserData);
        })
        .catch(err => {return res.status(500).json(err);});
    },
   
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found' });
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            return res.status(500).json(err);
        });
    },
    
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found' });
            }
            return User.findOneAndUpdate(
                { username: dbThoughtData.username },
                { $pull: { thoughts: params.id } }
            )
        })
        .then(() => {
            res.json({ message: 'Thought deleted.' });
        })
        .catch(err => {return res.status(500).json(err);});
    },
    
    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { 
                new: true,
                runValidators: true
            }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found' });
            }
            res.json(dbThoughtData);
        })
        .catch(err => {return res.status(500).json(err)});
    },

    deleteReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params._id } } },
            { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found' });
            }
            res.json({ message: 'Reaction deleted.' });
        })
        .catch(err => {return res.status(500).json(err);});
    },
}

module.exports = thoughtController;