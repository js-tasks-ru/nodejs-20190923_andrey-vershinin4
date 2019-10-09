let clients = Object.create(null);

exports.subscribe = (ctx) => {
  const r = Math.random();

  return new Promise((resolve) => {
    clients[r] = resolve;
    console.log('clients :', Object.keys(clients));

    ctx.res.on('close', () => {
      delete clients[r];
    });
  });
};

exports.publish = (message) => {
  console.log(`publish ${message}`);

  for (const r in clients) {
    const resolve = clients[r];
    resolve(message);
  }

  clients = Object.create(null);
};
