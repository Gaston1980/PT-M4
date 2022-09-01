const app = require('./server');
const { db } = require('./db');
const { router } = require('./server');
const Character = require('./db/models/Character');
const PORT = 3000;


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  db.sync({ force: true });
});