const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    //throw error
    throw new Error("Invalid request. username or password is not provided");
  }

  if (!isValid(username)) {
    // throw error
    res.status(404).send({ message: "User already exists!" });
  }

  users.push({ username, password });

  return res
    .status(200)
    .json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  const getBookList = () => {
    return new Promise((resolve) => {
      resolve(books);
    });
  };
  const response = await getBookList();
  //Write your code here
  return res.status(200).json(response);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  const getBookByISBN = (isbn) => {
    return new Promise((resolve) => {
      const book = books[isbn];
      resolve(book);
    });
  };
  const isbn = req.params.isbn;
  const book = await getBookByISBN(isbn);

  return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  const getBookByAuthor = (author) => {
    return new Promise((resolve) => {
      const booksData = Object.values(books);
      const authorBooks = booksData.filter((book) => book.author === author);
      resolve(authorBooks);
    });
  };

  const author = req.params.author;
  const response = await getBookByAuthor(author);
  return res.status(200).json(response);
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  const getBookByTitle = (title) => {
    return new Promise((resolve) => {
      const booksData = Object.values(books);
      const authorBooks = booksData.filter((book) => book.title === title);
      resolve(authorBooks);
    });
  };
  const title = req.params.title;
  const response = await getBookByTitle(title);
  return res.status(200).json(response);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
