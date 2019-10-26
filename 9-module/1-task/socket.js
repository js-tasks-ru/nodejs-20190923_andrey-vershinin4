const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  // Check authentication before connect
  io.use(async function(socket, next) {
    // check token
    const query = socket.handshake.query;
    if (!query.token) {
      // console.error('Error: anonymous sessions are not allowed');
      return next(new Error('anonymous sessions are not allowed'));
    }

    // check if there's a session with such token
    const session = await Session.findOne({token: query.token}).populate('user');
    if (!session) {
      // console.error('Error: wrong or expired session token');
      return next(new Error('wrong or expired session token'));
    }

    socket.user = session.user;
    next();
  });


  io.on('connection', async function(socket) {
    // console.log('User connected on WS');

    socket.on('message', async (msg) => {
      // console.info('Message:', msg);

      await Message.create({
        date: new Date(),
        text: msg,
        chat: socket.user.id,
        user: socket.user.displayName,
      });
    });
  });

  return io;
}

module.exports = socket;
