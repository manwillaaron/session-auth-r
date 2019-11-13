const bcrypt = require("bcrypt");
saltRounds = 10;

module.exports = {
  async register(req, res) {
    const db = req.app.get("db");
    const { email, password, isAdmin } = req.body;
    console.log(req.body);
    let newUser = await db.get_user_username(email);
    newUser = newUser[0];
    if (newUser) {
      return res.status(400).send("email already in use try logging in");
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    newUser = await db.register([email, hash, isAdmin]);
    req.session.user = {
      id: newUser[0].id,
      isAdmin: isAdmin
    };
    res.status(200).send(req.session.user);
  },
  async login(req, res) {
    const db = req.app.get("db");
    const { email, password } = req.body;
    const sessionUser = await db.get_user_username(email);
    console.log(sessionUser[0]);
    if (!sessionUser[0]) {
      return res.status(404).send("you don't exist");
    }
    const passwordCheck = bcrypt.compareSync(password, sessionUser[0].password);
    if (!passwordCheck) {
      return res.status(404).send("password is incorrect dummy!");
    }
    req.session.user = {
      id: sessionUser[0].id,
      isAdmin: sessionUser[0].isadmin
    };
    res.status(200).send(req.session.user);
  },

  async logout(req, res) {
    await req.session.destroy();
    res.sendStatus(200)
  }
};
