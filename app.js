const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");
const mongoose = require("mongoose");

const homeStartingContent =
  '"Poetry is the clear expression of mixed feelings"';
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));

mongoose.connect(
  "mongodb+srv://sam:sammelvin22@cluster0.hb4cn.mongodb.net/blogDB",
  { useNewUrlParser: true }
);

const postSchema = {
  author: String,
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/contact", (req, res) => {
  const auth = {
    auth: {
      api_key: "key-9123dac4217072cb557aaa74e4d42972",
      domain: "sandbox80d330685fcf4257940dd0e53857400a.mailgun.org",
    },
  };

  const transporter = nodemailer.createTransport(mailGun(auth));

  const mailOption = {
    from: req.body.contactEmail,
    to: "sammelvin2232002@gmail.com",
    subject: "Message from" + req.body.contactName,
    text: req.body.contactMsg,
  };

  transporter.sendMail(mailOption, (err, data) => {
    res.redirect("success");
  });
});

app.get("/success", (req, res) => {
  res.render("success");
});

app.get("/write", (req, res) => {
  res.render("write", { aboutContent: aboutContent });
});

app.post("/write", (req, res) => {
  const post = new Post({
    author: req.body.postAuthor,
    title: req.body.postTitle,
    content: req.body.postContent,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, (err, post) => {
    res.render("post", {
      author: post.author,
      title: post.title,
      content: post.content,
    });
  });
});

app.get("/subscribe", (req, res) => {
  res.render("subscribe");
});

app.post("/subscribe", (req, res) => {
  const option = {
    url: "https://<dc>.api.mailchimp.com/3.0/",
  };
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

app.listen(port, () => {
  console.log("Server has started successfully");
});
