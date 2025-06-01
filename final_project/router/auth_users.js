const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return !users.find((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return !!users.find(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    //throw error
    throw new Error("invalid request. Username or password is not provided");
  }
  if (!authenticatedUser(username, password)) {
    throw new Error("Wrong username or password");
  }

  let accessToken = jwt.sign(
    {
      username,
    },
    "access",
    { expiresIn: 60 * 60 }
  );
  req.session.authorization = {
    accessToken,
    username,
  };
  return res.status(200).json({ message: "User successfully logged in" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  if (!review) {
    //throw error
    throw new Error("Invalid request. review is not provided");
  }

  const book = books[isbn];
  if (!book) {
    throw new Error(`Can not find the book with ${isbn}`);
  }

  const allReviews = book.reviews;
  const existingReview = allReviews?.[username];
  allReviews[username] = review;

  return res.status(200).json({
    message: existingReview
      ? `Review for ${book.title} is successfully updated`
      : `Review for ${book.title} is successfully added`,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  const book = books[isbn];
  if (!book) {
    throw new Error(`Can not find the book with iban ${isbn}`);
  }
  if (!book.review?.[username]) {
    throw new Error(`Can not find the review with iban ${isbn}`);
  }
  delete book.reviews[username];

  res
    .status(200)
    .send({ message: `Review for ${book.title} is successfully deleted` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
