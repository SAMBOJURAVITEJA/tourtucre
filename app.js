let express = require("express");
const bcrypt = require("bcrypt");
let app = express();
app.use(express.json());
module.exports = app;
let DB = null;
let sqlite3 = require("sqlite3");
let { open } = require("sqlite");
let path = require("path");
let DBpath = path.join(__dirname, "userData.db");
let initializingDb = async () => {
  try {
    DB = await open({
      filename: DBpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running properly");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
initializingDb();
const validPassword = (password) => {
  if (password.length >= 5) {
    return true;
  }
};

app.post("/register", async (request, response) => {
  let { username, name, password, gender, location } = request.body;
  let hashedPassword = await bcrypt.hash(password, 2);
  let userIdentity = `select username from user where username="${username}";`;
  let userIdentityResult = await DB.get(userIdentity);
  if (userIdentityResult === undefined) {
    let data = `insert into user
                 (username,
                    name,
                   password,
                  gender,
                 location)
               values(
             "${username}","${name}"
    "${hashedPassword}","${gender}","${location}"
                     );`;
    if (validPassword(password)) {
      let result = await DB.run(data);
      response.status(200);
      response.send("User created successfully");
    } else {
      response.status(400);
      response.send("Password is too short");
    }
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

app.post("/login", async (request, response) => {
  let { username, password } = request.body;
  let hashedPassword = await bcrypt.compare(password, user.password);
  let userIdentity = `select username where username="${username}";`;
  if (userIdentity === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    if (hashedPassword === false) {
      response.status(400);
      response.send("Invalid password");
    } else {
      response.status(200);
      response.send("Login success!");
    }
  }
});
app.put("/change-password", async (request, response) => {
  let { username, oldPassword, newPassword } = request.body;
  let hashedPassword = await bcrypt(oldPassword, user.password);
  if (hashedPassword === false) {
    response.status(400);
    response.send("Invalid current password");
  } else {
    if (newPassword.length >= 5) {
      response.status(400);
      response.send("Password is too short");
    } else {
      let hashedPassword = await bcrypt.hash(newPassword, 2);
      let data = `update user
        set password="${hashedPassword}"
        where username="${username}";`;
      response.status(200);
      response.send("Password updated");
    }
  }
});
