const clients = new Set();

exports.subscribe = (ctx) => {
  return new Promise((resolve) => {
    clients.add(resolve);

    ctx.res.on('close', () => {
      clients.delete(resolve);
    });
  });
};

exports.publish = (message) => {
  clients.forEach((resolve) => resolve(message));
  clients.clear();
};
