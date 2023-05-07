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
    return new Promise((resolve, reject) => {
        if(books){
            resolve(books);
        } else {
            reject("No books");
        }
    })
    .then(booklist => {
        res.send(booklist);
    })
    .catch(err => {
        res.send(err);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
    const isbn = req.params.isbn;
    return new Promise((resolve, reject) => {
        if(books[isbn]){
            resolve(books[isbn]);
        } else {
            reject("No such book with this ISBN");
        }      
    })
    .then((book) => {
        res.send(book);
    })
    .catch((err) => {
        res.send("No such book with this ISBN");
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    return new Promise((resolve, reject) => {
        for(let book in books){
            if(books[book].author === author){
                resolve(books[book]);
            }
        }
        reject("No such author exists in the database");
    })
    .then((book) => {
        console.log(book);
        res.json(book);
    })
    .catch((err) => {
        res.send(err);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    return new Promise((resolve, reject) => {
        for(let book in books){
            if(books[book].title === title){
                resolve(books[book]);
            }
        }
        reject("No such book with this title exists in the database");
    })
    .then((book) => {
        console.log(book);
        res.json(book);
    })
    .catch((err) => {
        res.send(err);
    });
    
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {

    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
