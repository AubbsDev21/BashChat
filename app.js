const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Chatkit = require('@pusher/chatkit-server');

const app = express();

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:f40ef635-3256-40f0-9124-7a554253bf3d",
  key: "571e16ef-d0ac-40f3-b142-1c903edc763a:oszOyIj2O9q+TmftMRXDF+URfC+sTqioEnM+eCYqPqQ="
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
//this creates a root called "users" / means root. then err handling to see if users already exists 
app.post("/users", (req, res) => {
  const { username } = req.body;
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => {
      console.log(`User created: ${username}`);
      res.sendStatus(201);
    })
    .catch(err => {
      if (err.error === "services/chatkit/user_already_exists") {
        console.log(`User already exists: ${username}`);
        res.sendStatus(200);
      } else {
        res.status(err.status).json(err);
      }
    });
});
//this function auth end point the chatkit users 
app.post("/authenticate", (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id });
  res.status(authData.status).send(authData.body);
});



//this handles the apps server ports
const port = 3001;
app.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Running on port ${port}`);
  }
});