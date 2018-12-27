//reference or require all the packages below
const express = require("express");
const mongoose = require("mongoose");


//reference all the required custom files here
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

//the way to connect to DB is a little different if we are using mlab. We should use code something like below to make it happen
const db = require("./config/keys").mongoURL;

//connect to mongoDB. 
mongoose.connect(db)
    .then(()=> console.log("mongoDB is now connected"))
    .catch(err=> console.log(err));

const app = express();
//default route
app.get('/', (req, res) => res.send("hello!"));



//For some reason i am setting the use functionality here. I still dont understand the significance though
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/profile", profile);

//Generally the last lines in any web dev main program is setting up the port and making the connection
//We have to set the port on which the app will run as well. In case of local machine we can give any port number we want.
//In case of heroku we have to use process.env.PORT to find the port number assigned to our application and we will pass that as the parameter.
const port = process.env.PORT || 5000;

//Starting the server and listening to the port
app.listen(port, ()=> console.log(`server has started and is running on port ${port}`));