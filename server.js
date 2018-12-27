//reference or require all the packages below
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


//reference all the required custom files here
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profiles = require("./routes/api/profiles");

//the way to connect to DB is a little different if we are using mlab. We should use code something like below to make it happen
const db = require("./config/keys").mongoURL;

//connect to mongoDB. 
mongoose.connect(db)
    .then(()=> console.log("mongoDB is now connected"))
    .catch(err=> console.log(err));


//default route
app.get('/', (req, res) => res.send("hello!"));

//I will be adding all the required middlewares here
//adding bodyparser middleware below
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//For some reason i am setting the use fsunctionality here. I still dont understand the significance though
//Below its as good as the middleware is adding the /api/xyz prefix while calling the concerned xyz.js files.
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/profiles", profiles);

//Generally the last lines in any web dev main program is setting up the port and making the connection
//We have to set the port on which the app will run as well. In case of local machine we can give any port number we want.
//In case of heroku we have to use process.env.PORT to find the port number assigned to our application and we will pass that as the parameter.
const port = process.env.PORT || 5000;

//Starting the server and listening to the port
app.listen(port, ()=> console.log(`server has started and is running on port ${port}`));