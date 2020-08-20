const Router = require("koa-router");

const classes = new Router();
const classCtrl = require("./class.controller");

classes.get("/", classCtrl.list);
classes.get("/:id", classCtrl.get);
classes.post("/", classCtrl.create);
classes.delete("/:id", classCtrl.delete);
classes.put("/:id", classCtrl.replace);
classes.patch("/:id", classCtrl.update);

module.exports = classes;
