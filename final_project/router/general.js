const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "https://arturomorale-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai";


const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                if (books) {
                    resolve(books);
                } else {
                    reject("No books available");
                }
            });
        };

        const result = await getBooks();
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const getBookByISBN = (isbn) => {
            return new Promise((resolve, reject) => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject("Book not found");
                }
            });
        };

        const result = await getBookByISBN(isbn);
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (err) {
        return res.status(404).json({ message: err });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const getBooksByAuthor = (author) => {
            return new Promise((resolve, reject) => {
                let filtered_books = [];

                Object.keys(books).forEach((key) => {
                    if (books[key].author === author) {
                        filtered_books.push(books[key]);
                    }
                });

                if (filtered_books.length > 0) {
                    resolve(filtered_books);
                } else {
                    reject("No books found by this author");
                }
            });
        };

        const result = await getBooksByAuthor(author);
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (err) {
        return res.status(404).json({ message: err });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const getBooksByTitle = (title) => {
            return new Promise((resolve, reject) => {
                let filtered_books = [];

                Object.keys(books).forEach((key) => {
                    if (books[key].title === title) {
                        filtered_books.push(books[key]);
                    }
                });

                if (filtered_books.length > 0) {
                    resolve(filtered_books);
                } else {
                    reject("No books found with this title");
                }
            });
        };

        const result = await getBooksByTitle(title);
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (err) {
        return res.status(404).json({ message: err });
    }
});

module.exports.general = public_users;
