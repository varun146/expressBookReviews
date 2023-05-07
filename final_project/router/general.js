const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
    const username = req.body.username;
    const password = req.body.password;
    if(username && password){
        users.push({"username": username, "password": password});
        res.send("User added successfully");
    } else {
        res.send("Did not get the username or passsword");
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) { 
    res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
    const isbn = req.params.isbn;
    if(isbn){
        res.send(JSON.stringify(books[isbn]));
    } else {
        res.send("ISBN not provided");
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    for(let book in books){
        if(books[book].author === author){
            res.send(JSON.stringify(books[book]));
        }
    }
    res.send("No such author exists in the database;");

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    for(let book in books){
        if(books[book].title === title){
            res.send(JSON.stringify(books[book]));
        }
    }
    res.send("No such title exists in the database;");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
