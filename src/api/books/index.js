const Router = require("koa-router");

const books = new Router();
const booksCtrl = require("./books.controller");

books.get("/check", booksCtrl.list);
books.get("/exist/:value", booksCtrl.get);
books.post("/create", booksCtrl.create);
books.delete("/delete/:value", booksCtrl.delete);
books.put("/", booksCtrl.replace);
books.patch("/update/:value", booksCtrl.update);

module.exports = books;
