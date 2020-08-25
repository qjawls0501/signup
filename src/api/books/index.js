const Router = require("koa-router");

const books = new Router();
const booksCtrl = require("./books.controller");

books.get("/", booksCtrl.list);
books.get("/:id", booksCtrl.get);
books.post("/create", booksCtrl.create);
books.delete("/delete/:id", booksCtrl.delete);
books.put("/", booksCtrl.replace);
books.patch("/:id", booksCtrl.update);

module.exports = books;
