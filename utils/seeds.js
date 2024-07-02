const connection = require('../config/connection');
const { User } = require('../models');
const { randomName } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
   
    let thoughtCheck = await connection.db.listCollections({ name: 'thought' }).toArray();
    if (thoughtCheck.length) {
      await connection.dropCollection('thought');
    }

    let userCheck = await connection.db.listCollections({ name: 'user' }).toArray();
    if (userCheck.length) {
      await connection.dropCollection('user');
    }

  const users = [];

  for (let i = 0; i < 15; i++) {

    const username = randomName();
    const email = `${username}@gmail.com`

    users.push({
      username,
      email,
    });
  }

  const userData = await User.insertMany(users);

  console.table(users);
  console.info('Seeding has been completed, Sir');
  process.exit(0);
});