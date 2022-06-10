const passport = require("passport");
const lnurlAuth = require("passport-lnurl-auth");
const session = require("express-session");
const { HttpError, verifyAuthorizationSignature } = require("lnurl/lib");
const assert = require("assert");
const crypto = require("crypto");
const lnurl = require("lnurl");
const querystring = require("querystring");
const qrcode = require("qrcode");

const map = {
  user: new Map(),
  session: new Map(),
};

function setupAuth(app) {
  app.use(
    session({
      secret: "12345",
      resave: false,
      saveUninitialized: true,
    })
  );

  passport.use(
    new lnurlAuth.Strategy(function (linkingPublicKey, done) {
      let user = map.user.get(linkingPublicKey);
      if (!user) {
        user = { id: linkingPublicKey };
        map.user.set(linkingPublicKey, user);
      }
      done(null, user);
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(passport.authenticate("lnurl-auth"));
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    done(null, map.user.get(id) || null);
  });
  
  app.get(
    "/do-login",
    function (req, res, next) {
      next();
    },
    async function (req, res) {
      
      
      if (req.query.k1 || req.query.key || req.query.sig) {
        // Check signature against provided linking public key.
        // This request could originate from a mobile app (ie. not their browser).
        let session;
        assert.ok(
          req.query.k1,
          new HttpError('Missing required parameter: "k1"', 400)
        );
        assert.ok(
          req.query.sig,
          new HttpError('Missing required parameter: "sig"', 400)
        );
        assert.ok(
          req.query.key,
          new HttpError('Missing required parameter: "key"', 400)
        );
        session = map.session.get(req.query.k1);
        assert.ok(
          session,
          new HttpError("Secret does not match any known session", 400)
        );
        const { k1, sig, key } = req.query;
        assert.ok(
          verifyAuthorizationSignature(sig, k1, key),
          new HttpError("Invalid signature", 400)
        );
        session.lnurlAuth = session.lnurlAuth || {};
        session.lnurlAuth.linkingPublicKey = req.query.key;
        
        
        const result = await session.save();  
        console.log(result);
        res.status(200).json({ status: "OK" });
    }
      
    req.session = req.session || {};
    req.session.lnurlAuth = req.session.lnurlAuth || {};
    let k1 = req.session.lnurlAuth.k1 || null;
    if (!k1) {
      k1 = req.session.lnurlAuth.k1 = generateSecret(32, "hex");
      map.session.set(k1, req.session);
    }

    const callbackUrl =
      "https://" +
      `${req.get("host")}/do-login?${querystring.stringify({
        k1,
        tag: "login",
      })}`;

    const encoded = lnurl.encode(callbackUrl).toUpperCase();
    const qrCode = await qrcode.toDataURL(encoded);
    return res.json({
      lnurl: encoded,
      qrCode: qrCode,
    });
  }
  );

  app.get("/logout", function (req, res, next) {
    if (req.user) {
      req.session.destroy();
      return res.redirect("/");
    }
    next();
  });

  app.get("/me", function (req, res, next) {
    res.json({ user: req.user ? req.user : null });

    next();
  });

  app.get("/profile", function (req, res, next) {
    if (!req.user) {
      return res.redirect("/login");
    }

    res.render("profile", { user: req.user });

    next();
  });
}

const generateSecret = function (numBytes, encoding) {
  numBytes = numBytes || 32;
  encoding = encoding || "hex";
  return crypto.randomBytes(numBytes).toString(encoding);
};

module.exports = { setupAuth: setupAuth };
