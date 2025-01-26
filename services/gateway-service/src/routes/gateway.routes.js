const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const router = express.Router();
const querystring = require("querystring");

function handleProxyReq(proxyReq, req, res, options) {
  if (!req.body || !Object.keys(req.body).length) {
    return;
  }

  let contentType = req.header("Content-Type");
  let bodyData;

  if (contentType.includes("application/json")) {
    bodyData = JSON.stringify(req.body);
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    bodyData = querystring.stringify(req.body);
  } else {
    bodyData = req.body;
  }

  if (bodyData) {
    proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
}

// Setup proxy middleware
router.use(
  "/auth",
  createProxyMiddleware({
    target: "http://auth:8001",
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "" },
    onProxyReq: handleProxyReq,
  })
);

// Setup REST API proxy middleware
router.use(
  "/notification",
  createProxyMiddleware({
    target: "http://notification:8004",
    changeOrigin: true,
    pathRewrite: {
      "^/api/notification": "",
    },
    onProxyReq: handleProxyReq,
  })
);

router.use(
  "/chat",
  createProxyMiddleware({
    target: "http://chat:8022",
    changeOrigin: true,
    pathRewrite: {
      "^/api/chat": "",
    },
    onProxyReq: handleProxyReq,
  })
);

module.exports = router;
