const Router = require("koa-router");

const classes = new Router();
const classCtrl = require("./class.controller");

classes.post("/register/local", classCtrl.localregister);
classes.get("/:id", classCtrl.get);
classes.delete("/:id", classCtrl.delete);
classes.put("/:id", classCtrl.replace);
classes.patch("/:id", classCtrl.update);

module.exports = classes;
