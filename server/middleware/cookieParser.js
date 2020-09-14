const parseCookies = (req, res, next) => {


  console.log(req.headers.cookie);
  var cookies = req.headers.cookie;
  var cookiesObj = {};
  if (cookies) {
    cookies.split('; ').forEach((cookie) => {
      cookie = cookie.split('=');
      cookiesObj[cookie[0]] = cookie[1];
    });
  }

  req.cookies = cookiesObj;
  next();
};

module.exports = parseCookies;