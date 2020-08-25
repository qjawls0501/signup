const Router = require("koa-router");

const api = new Router();
const auth = require("./auth");
// const classes = require("./class");
api.use("/auth", auth.routes());
// api.use("/class", classes.routes());

module.exports = api;
