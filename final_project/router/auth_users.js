const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 

    const validUsers = users.filter(user => {
        return (user.username === username && user.password  === password);
    })
    if(validUsers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password ){
        res.send("Try again with username and password");
    }

    if(authenticatedUser(username, password)){
        const accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60});

        req.session.authorization = {
            accessToken, username
        }

        console.log(req.session.authorization.username);
    
        res.send("User successfully logged in");
    } else {
        res.send("No such user exists, try signing up");
    }

    
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
    const review = req.query.review;
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    console.log(username);

    // if user already has a review -> just update it
    if(books[isbn].reviews[username]){
        books[isbn].reviews[username] = review;
        res.send("Review updated successfully");
    }

    // if doesn't? just add a new one
    books[isbn].reviews[username] = review;
    res.send("Review added successfully");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        res.send("No such book exists in the database");
        return;
      }
    
      const reviews = books[isbn].reviews;
      if (!reviews) {
        res.send("No reviews available for this book");
        return;
      }
    
      const reviewByUser = reviews[username];
      if (!reviewByUser) {
        res.send("No review by this user available for this book");
        return;
      }

      delete reviews[username];
      res.send("Review deleted successfully");
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
