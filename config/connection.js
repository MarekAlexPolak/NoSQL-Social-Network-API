const { connect, connection } = require('mongoose');

connect(
    //process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmediaDB', 
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studentsDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = connection;