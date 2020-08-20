const Joi = require("joi");
const Account = require("models/account");

// 로컬 회원가입
exports.localRegister = async (ctx) => {
  // 데이터 검증
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    passwordConfirm: Joi.string().required().min(6),
    username: Joi.string().min(2).max(15).required(),
    phonenum: Joi.string().required(),
    birthday: Joi.string().min(8).max(8).required(),
    authnum: Joi.string().min(4).max(4).required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    return;
  }

  /* TODO: 아이디 / 이메일 중복처리 구현 */
  let existing = null;
  try {
    existing = await Account.findByEmailOrUsername(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (existing) {
    // 중복되는 아이디/이메일이 있을 경우
    ctx.status = 409; // Conflict
    // 어떤 값이 중복되었는지 알려줍니다
    ctx.body = {
      key: "email",
    };
    return;
  }
  // 계정 생성
  let account = null;
  try {
    account = await Account.localRegister(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }
  let token = null;
  try {
    token = await account.generateToken();
  } catch (e) {
    ctx.throw(500, e);
  }
  ctx.cookies.set("access_token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  ctx.body = account.profile; // 프로필 정보로 응답합니다.
};

// 로컬 로그인
exports.localLogin = async (ctx) => {
  // 데이터 검증
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400; // Bad Request
    return;
  }

  const { email, password } = ctx.request.body;

  let account = null;
  try {
    // 이메일로 계정 찾기
    account = await Account.findByEmail(email);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (!account || !account.validatePassword(password)) {
    // 유저가 존재하지 않거나 || 비밀번호가 일치하지 않으면
    ctx.status = 400; // Forbidden
    return;
  }
  let token = null;
  try {
    token = await account.generateToken();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.cookies.set("access_token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  ctx.body = account.profile; // 프로필 정보로 응답합니다.
};

// 이메일 / 아이디 존재유무 확인
exports.exists = async (ctx) => {
  const { key, value } = ctx.params;
  let account = null;

  try {
    // key 에 따라 findByEmail 혹은 findByUsername 을 실행합니다.
    account = await Account.findByEmail(value);
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = {
    exists: account !== null,
  };
};

// 로그아웃
exports.logout = (ctx) => {
  ctx.cookies.set("access_token", null, {
    maxAge: 0,
    httpOnly: true,
  });
  ctx.status = 204;
};
exports.check = (ctx) => {
  const { user } = ctx.request;

  if (!user) {
    ctx.status = 403; // Forbidden
    return;
  }

  ctx.body = user.profile;
};
