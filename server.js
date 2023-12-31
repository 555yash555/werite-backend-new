import http from "http";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import poolRoutes from "./routes/poolRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import videoRecordingRoutes from "./routes/videoRecordingRoutes.js";
import upVotesRoutes from "./routes/upVoteRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import downVotesRoutes from "./routes/downVoteRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import _ from "lodash";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const options = {
  key: fs.readFileSync(new URL(config.sslKey, import.meta.url), "utf-8"),
  cert: fs.readFileSync(new URL(config.sslCrt, import.meta.url), "utf-8"),
  // key: fs.readFileSync(path.join(__dirname, config.sslKey), 'utf-8'),
  // cert: fs.readFileSync(path.join(__dirname, config.sslCrt), 'utf-8'),
};
const httpsServer = https.createServer(options, app);
// const server = app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
const notificationSocket = new Server(httpsServer, {
  cors: {
    origin: "*",
  },
  path: "/notification",
});

const messageSocket = new Server(httpsServer, {
  cors: {
    origin: "*",
  },
  path: "/messages",
});

// Middleware
app.use(express.json()); // parse json bodies in the request object

const activeUsers = new Set();

notificationSocket
  .use(async function (socket, next) {
    try {
      if (socket.handshake.query && socket.handshake.query.token) {
        const decoded = await promisify(jwt.verify)(
          socket.handshake.query.token,
          process.env.JWT_SECRET
        );
        socket.decoded = decoded;
        next();
      } else {
        next(new Error("Authentication error"));
      }
    } catch (e) {
      // console.log(e);
    }
  })
  .on("connection", (socket) => {
    console.log(`User ${socket.decoded.id} connected!`);

    socket.join(socket.decoded.id);

    // socket.on("new_user", () => {
    //   activeUsers.add(socket.decoded.id);
    //   const updateUserStatus = async (req, res, next) => {
    //     try {
    //       await User.isUserActive(socket.decoded.id);
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   };
    //   updateUserStatus();
    //   console.log([...activeUsers]);
    //   socket.broadcast.emit("onlineUsers", [...activeUsers]);
    // });

    socket.on("notification", ({ userId, message }) => {
      // console.log("noti", userId);

      socket.broadcast.to(userId).emit("notificationRefresh", {
        message,
      });
    });

    // socket.on("disconnect", () => {
    //   activeUsers.delete(socket.decoded.id);
    //   const updateUserStatus = async (req, res, next) => {
    //     try {
    //       await User.isUserNotActive(socket.decoded.id);
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   };
    //   console.log("disconnect " + [...activeUsers]);
    //   updateUserStatus();
    //   socket.emit("user_disconnected", socket.decoded.id);
    // });
  });

// message sockeet
messageSocket
  .use(async function (socket, next) {
    try {
      if (socket.handshake.query && socket.handshake.query.token) {
        const decoded = await promisify(jwt.verify)(
          socket.handshake.query.token,
          process.env.JWT_SECRET
        );
        socket.decoded = decoded;
        next();
      } else {
        next(new Error("Authentication error"));
      }
    } catch (e) {
      console.log(e);
    }
  })
  .on("connection", (socket) => {
    // Join a room based on the user's ID

    // Event handler for joining a chat
    socket.on("joinChat", (chat) => {
      console.log(
        `User ${socket.decoded.id} connected! to chat ${chat.chatId}`
      );
      socket.join(chat.chatId);
    });

    // Event handler for sending a message
    socket.on("sendMessage", async (message, chat) => {
      console.log("message", message);
      console.log("chat", chat);
      let user_socket = socket.id;
      messageSocket
        .to(chat.chatId)
        .except(user_socket)
        .emit("messageSent", message);
    });
    // Event handler for disconnecting
    socket.on("disconnect", () => {
      socket.emit("offline");
    });

    socket.on("typing", (chat) => {
      let user_socket = socket.id;
      socket.to(chat.chatId).except(user_socket).emit("typingStarted", chat);
    });

    socket.on("stopTyping", (chat) => {
      let user_socket = socket.id;
      socket.to(chat.chatId).except(user_socket).emit("typingStopped", chat);
    });
  });

// Redirect requests to endpoint
app.use("/api/users", userRoutes);
app.use("/api/pools", poolRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/videoRecording", videoRecordingRoutes);
app.use("/api/upvotes", upVotesRoutes);
app.use("/api/downvotes", downVotesRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/post", postRoutes);

// Global Error Handler. IMPORTANT function params MUST start with err
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: "Something went rely wrong",
  });
});

dotenv.config();

("use strict");

/*
███████ ███████ ██████  ██    ██ ███████ ██████  
██      ██      ██   ██ ██    ██ ██      ██   ██ 
███████ █████   ██████  ██    ██ █████   ██████  
     ██ ██      ██   ██  ██  ██  ██      ██   ██ 
███████ ███████ ██   ██   ████   ███████ ██   ██                                           

dependencies: {
    body-parser             : https://www.npmjs.com/package/body-parser
    compression             : https://www.npmjs.com/package/compression
    colors                  : https://www.npmjs.com/package/colors
    cors                    : https://www.npmjs.com/package/cors
    crypto-js               : https://www.npmjs.com/package/crypto-js
    express                 : https://www.npmjs.com/package/express
    httpolyglot             : https://www.npmjs.com/package/httpolyglot
    mediasoup               : https://www.npmjs.com/package/mediasoup
    mediasoup-client        : https://www.npmjs.com/package/mediasoup-client
    ngrok                   : https://www.npmjs.com/package/ngrok
    qs                      : https://www.npmjs.com/package/qs
    @sentry/node            : https://www.npmjs.com/package/@sentry/node
    @sentry/integrations    : https://www.npmjs.com/package/@sentry/integrations
    socket.io               : https://www.npmjs.com/package/socket.io
    swagger-ui-express      : https://www.npmjs.com/package/swagger-ui-express
    uuid                    : https://www.npmjs.com/package/uuid
    yamljs                  : https://www.npmjs.com/package/yamljs
}
*/

/**
 * MiroTalk SFU - Server component
 *
 * @link    GitHub: https://github.com/miroslavpejic85/mirotalksfu
 * @link    Live demo: https://sfu.mirotalk.com
 * @license For open source use: AGPLv3
 * @license For commercial or closed source, contact us at info.mirotalk@gmail.com
 * @author  Miroslav Pejic - miroslav.pejic.85@gmail.com
 * @version 1.0.0
 *
 */

// const express = require('express');
// import express from 'express'
import cors from "cors";
import compression from "compression";
// import http from 'httpolyglot';
import https from "httpolyglot";
import mediasoup from "mediasoup";
import mediasoupClient from "mediasoup-client";
import config from "./app/src/config.js";
import path from "path";
import ngrok from "ngrok";
import fs from "fs";
import Host from "./app/src/Host.js";
import Room from "./app/src/Room.js";
import Peer from "./app/src/Peer.js";
import ServerApi from "./app/src/ServerApi.js";
import Logger from "./app/src/Logger.js";
const log = new Logger("Server");
import yamlJS from "yamljs";
import swaggerUi from "swagger-ui-express";
import Sentry from "@sentry/node";
import { CaptureConsole } from "@sentry/integrations";
import Pool from "./models/Pool.js";
import PoolRequest from "./models/PoolRequest.js";
import Notification from "./models/Notification.js";
import cookieParser from "cookie-parser";
app.use(cookieParser());

// Slack API
import CryptoJS from "crypto-js";
import qS from "qs";

const slackEnabled = config.slack.enabled;
const slackSigningSecret = config.slack.signingSecret;
import bodyParser from "body-parser";

//ES modules
import { createServer } from "http";

const vidio = new Server(httpsServer, {
  maxHttpBufferSize: 1e7,
  transports: ["websocket"],
});
const host = "https://" + "localhost" + ":" + config.listenPort; // config.listenIp
console.log(`host: ${host}`);
const announcedIP = config.mediasoup.webRtcTransport.listenIps[0].announcedIp;

const hostCfg = {
  protected: config.hostProtected,
  username: config.hostUsername,
  password: config.hostPassword,
  authenticated: !config.hostProtected,
};

const apiBasePath = "/api/v1"; // api endpoint path
const api_docs = host + apiBasePath + "/docs"; // api docs

// Sentry monitoring
const sentryEnabled = config.sentry.enabled;
const sentryDSN = config.sentry.DSN;
const sentryTracesSampleRate = config.sentry.tracesSampleRate;
if (sentryEnabled) {
  Sentry.init({
    dsn: sentryDSN,
    integrations: [
      new CaptureConsole({
        // ['log', 'info', 'warn', 'error', 'debug', 'assert']
        levels: ["warn", "error"],
      }),
    ],
    tracesSampleRate: sentryTracesSampleRate,
  });
  /*
    log.log('test-log');
    log.info('test-info');
    log.warn('test-warning');
    log.error('test-error');
    log.debug('test-debug');
    */
}

// Authenticated IP by Login
let authHost;

// all mediasoup workers
let workers = [];
let nextMediasoupWorkerIdx = 0;

// all Room lists
let roomList = new Map();

// directory
import { fileURLToPath } from "url";
import { protect } from "./middlewares/authMiddleware.js";
import User from "./models/User.js";
import { generateUploadURL } from "./s3.js";
import Bookmarks from "./models/Bookmark.js";

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
console.log("directory-name", __dirname);

const dir = {
  public: path.join(__dirname, "./public"),
};

const views = {
  about: path.join(__dirname, "./public/views/about.html"),
  landing: path.join(__dirname, "./public/views/landing.html"),
  login: path.join(__dirname, "./public/views/login.html"),
  newRoom: path.join(__dirname, "./public/views/newroom.html"),
  notFound: path.join(__dirname, "./public/views/404.html"),
  permission: path.join(__dirname, "./public/views/permission.html"),
  privacy: path.join(__dirname, "./public/views/privacy.html"),
  room: path.join(__dirname, "./public/views/Room.html"),
  hostroom: path.join(__dirname, "./public/views/HostRoom.html"),
};
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.static(dir.public));
app.use(bodyParser.urlencoded({ extended: true }));

// all start from here
app.get("*", function (next) {
  next();
});

// Remove trailing slashes in url handle bad requests
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError || err.status === 400 || "body" in err) {
    log.error("Request Error", {
      header: req.headers,
      body: req.body,
      error: err.message,
    });
    return res.status(400).send({ status: 404, message: err.message }); // Bad request
  }
  if (req.path.substr(-1) === "/" && req.path.length > 1) {
    let query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
  } else {
    next();
  }
});

// set new room name and join
app.get(["/newroom"], (req, res) => {
  if (hostCfg.protected == true) {
    let ip = getIP(req);

    if (allowedIP(ip)) {
      res.sendFile(views.newRoom);
    } else {
      hostCfg.authenticated = false;
      res.sendFile(views.login);
    }
  } else {
    res.sendFile(views.newRoom);
  }
});

// no room name specified to join || direct join
app.get("/join/", (req, res) => {
  if (hostCfg.authenticated && Object.keys(req.query).length > 0) {
    log.debug("Direct Join", req.query);
    // http://localhost:3010/join?room=test&password=0&name=mirotalksfu&audio=1&video=1&screen=1&notify=1
    const { room, password, name, audio, video, screen, notify } = req.query;
    if (room && password && name && audio && video && screen && notify) {
      return res.sendFile(views.room);
    }
  }
  res.redirect("/");
});
app.get("/join/poolDat/:id", protect, async (req, res) => {
  try {
    const pool_id = req.params.id;
    let poolData = await Pool.findById(pool_id);
    poolData = poolData[0][0];
    if (poolData) {
      let prompts = await Prompt.findByPoolId(req.params.id);
      if (prompts) {
        prompts = prompts[0];
        poolData.prompts = prompts;
        return res.status(200).json(poolData);
      }
    } else {
      return res.status(400).json({ message: "Pool not found" });
    }
  } catch (error) {
    console.log(error);
  }
});
//join room get pools
app.get("/join/poolData/:id", protect, async (req, res) => {
  try {
    const pool_id = req.params.id;
    let poolData = await Pool.findById(pool_id);
    poolData = poolData[0][0];
    res.status(200).json(poolData);
  } catch (error) {
    console.log(error);
  }
});
// join room
app.get("/join/:id", protect, async (req, res) => {
  //
  // ### THIS IS USED FOR JOINING A ROOM ###
  //

  console.log("/join/:id: ", req.params.id);
  // console.log("\nJoining caLL\n");
  //console.log(`app.get(/join/:id)`)
  //console.log(`req.params.id:  ${req.params.id}`);
  // console.log(`req.user.user_id: ${req.user.user_id}`)
  // if (hostCfg.authenticated) {
  //     res.sendFile(views.room);
  // } else {
  //     res.redirect('/');
  // }
  try {
    if (hostCfg.authenticated) {
      const pool_id = req.params.id;
      const user_id = req.user.user_id;

      let isUserAlreadyInACall = await User.isUserInCall(user_id);
      isUserAlreadyInACall = isUserAlreadyInACall[0][0];
      console.log(`isUdaerinCall : ${isUserAlreadyInACall}`);
      if (isUserAlreadyInACall) {
        console.log("user is in call");
        return res
          .status(200)
          .json({ message: "You have already joined another call" });
      }

      let isUserHost = await Pool.isUserHostOfPool(user_id, pool_id);
      isUserHost = isUserHost[0][0];
      if (!isUserHost) {
        let isCurrentPoolActive = await Pool.isCurrentPoolActive(pool_id);
        isCurrentPoolActive = isCurrentPoolActive[0][0];
        if (!isCurrentPoolActive) {
          return res
            .status(404)
            .json({ message: "Pool Call Currently Not Active" });
        }
        let isUserAllowedToJoinPool = await Pool.isUserAllowedToJoinPool(
          pool_id,
          user_id
        );
        isUserAllowedToJoinPool = isUserAllowedToJoinPool[0][0];

        if (!isUserAllowedToJoinPool) {
          return res
            .status(404)
            .json({ message: "Not authorised to join this call" });
        }

        return res.sendFile(views.room);
      } else {
        //console.log("\n\n\n NOTIII \n\n\n\n")

        let poolData = await Pool.findById(pool_id);
        poolData = poolData[0][0];

        //console.log(poolData)

        if (!poolData.noti_sent) {
          let PoolRequests = await PoolRequest.findAll(pool_id);
          PoolRequests = PoolRequests[0];

          for (let i = 0; i < PoolRequests.length; i++) {
            if (PoolRequests[i].status === "accepted") {
              let notification = new Notification(
                `${req.user.username} has Started the pool ${poolData.title}`,
                PoolRequests[i].user_id,
                "pool start",
                `http://localhost:8080/join/${pool_id}`
              );
              notification = await notification.save();
            }
          }
          await Pool.setPoolNotification(pool_id);
        }

        // res.sendFile(views.room);
        return res.sendFile(views.hostroom);
      }
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/join/pool/:id", protect, async (req, res) => {
  console.log("/join/pool/:id", req.params.id);

  try {
    let pool_id = req.params.id;
    let user_id = req.user.user_id;
    let isUserAlreadyInACall = await User.isUserInCall(user_id);
    isUserAlreadyInACall = isUserAlreadyInACall[0][0];
    // console.log(`isUdaerinCall : ${isUserAlreadyInACall}`);
    if (isUserAlreadyInACall) {
      console.log("user is in call");
      res.status(200).json({ message: "You have already joined another call" });
      return;
    }
    let isCurrentPoolActive = await Pool.isCurrentPoolActive(pool_id);
    isCurrentPoolActive = isCurrentPoolActive[0][0];
    let isUserAllowedToJoinPool = await Pool.isUserAllowedToJoinPool(
      pool_id,
      user_id
    );
    isUserAllowedToJoinPool = isUserAllowedToJoinPool[0][0];
    // console.log(`isUserAllowedToJoinPool : ${isUserAllowedToJoinPool}`);

    // console.log(`isCurrentPoolActive : ${isCurrentPoolActive}`);
    if (!isUserAllowedToJoinPool) {
      console.log("Not authorised to join call");
      return res
        .status(200)
        .json({ message: "Not authorised to join this call" });
    }
    if (!isCurrentPoolActive) {
      console.log("Pool not active");
      return res
        .status(200)
        .json({ message: "Pool Call Currently Not Active" });
    }
    return res.status(200).json({ message: "Call Active" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.patch("/join/:id/:isactive", async (req, res) => {
  console.log("Updating pool isactive status");
  let pool_id = req.params.id;
  let isactive = req.params.isactive;
  await Pool.setActiveStatusOfPool(pool_id, isactive);
});

app.patch("/update/userincall/:id", protect, async (req, res) => {
  console.log("UPDATING user in call status");
  let inCall = req.params.id;
  let user_id = req.user.user_id;
  await User.setUserCallStatus(user_id, inCall);
  return res.status(200).json({ message: "user in call updated" });
});

app.patch("/update/usernotincall", protect, async (req, res) => {
  console.log("Updating user not in call status");
  let user_id = req.user.user_id;
  await User.setUserCallStatus(user_id, 0);
  console.log("THIS IS THE EXIT BUTTON IN ACTION");
  return res.status(200).json({ message: "user not in call updated" });
});

app.get("/isuserincall", protect, async (req, res) => {
  try {
    let user_id = req.user.user_id;
    let isUserAlreadyInACall = await User.isUserInCall(user_id);
    isUserAlreadyInACall = isUserAlreadyInACall[0][0];
    if (isUserAlreadyInACall) {
      return res
        .status(200)
        .json({ message: "You have already joined another call" });
    } else {
      return res.status(200).json({ message: "You can join another call" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/iscurrentpoolempty/:poolid", async (req, res) => {
  let pool_id = req.params.poolid;
  let isCurrentPoolEmpty = await User.isCurrentPoolEmpty(pool_id);
  isCurrentPoolEmpty = isCurrentPoolEmpty[0][0];
  if (!isCurrentPoolEmpty) {
    res.status(200).json({ message: "Pool Empty" });
    return;
  } else {
    res.status(200).json({ message: "Pool Not Empty" });
    return;
  }
});

// if not allow video/audio
app.get(["/permission"], (req, res) => {
  res.sendFile(views.permission);
});

// privacy policy
app.get(["/privacy"], (req, res) => {
  res.sendFile(views.privacy);
});

// mirotalk about
app.get(["/about"], (req, res) => {
  res.sendFile(views.about);
});

app.get("/s3Url/:recordingname", async (req, res) => {
  //   console.log(`res: ${req}`);
  const vidRecURL = await generateUploadURL(req.params.recordingname);
  //   console.log(`vid url ${vidRecURL}`);
  res.send({ vidRecURL });
});

// ####################################################
// API
// ####################################################

// request meeting room endpoint
app.post(["/api/v1/meeting"], (req, res) => {
  // check if user was authorized for the api call
  let host = req.headers.host;
  let authorization = req.headers.authorization;
  let api = new ServerApi(host, authorization);
  if (!api.isAuthorized()) {
    log.debug("MiroTalk get meeting - Unauthorized", {
      header: req.headers,
      body: req.body,
    });
    return res.status(403).json({ error: "Unauthorized!" });
  }
  // setup meeting URL
  let meetingURL = api.getMeetingURL();
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ meeting: meetingURL }));
  // log.debug the output if all done
  log.debug("MiroTalk get meeting - Authorized", {
    header: req.headers,
    body: req.body,
    meeting: meetingURL,
  });
});

// request join room endpoint
app.post(["/api/v1/join"], (req, res) => {
  // check if user was authorized for the api call
  let host = req.headers.host;
  let authorization = req.headers.authorization;
  let api = new ServerApi(host, authorization);
  if (!api.isAuthorized()) {
    log.debug("MiroTalk get join - Unauthorized", {
      header: req.headers,
      body: req.body,
    });
    return res.status(403).json({ error: "Unauthorized!" });
  }
  // setup Join URL
  let joinURL = api.getJoinURL(req.body);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ join: joinURL }));
  // log.debug the output if all done
  log.debug("MiroTalk get join - Authorized", {
    header: req.headers,
    body: req.body,
    join: joinURL,
  });
});

// ####################################################
// SLACK API
// ####################################################

app.post("/slack", (req, res) => {
  if (!slackEnabled)
    return res.end("`Under maintenance` - Please check back soon.");

  log.debug("Slack", req.headers);

  if (!slackSigningSecret) return res.end("`Slack Signing Secret is empty!`");

  let slackSignature = req.headers["x-slack-signature"];
  let requestBody = qS.stringify(req.body, { format: "RFC1738" });
  let timeStamp = req.headers["x-slack-request-timestamp"];
  let time = Math.floor(new Date().getTime() / 1000);

  if (Math.abs(time - timeStamp) > 300)
    return res.end("`Wrong timestamp` - Ignore this request.");

  let sigBaseString = "v0:" + timeStamp + ":" + requestBody;
  let mySignature =
    "v0=" + CryptoJS.HmacSHA256(sigBaseString, slackSigningSecret);

  if (mySignature == slackSignature) {
    let host = req.headers.host;
    let api = new ServerApi(host);
    let meetingURL = api.getMeetingURL();
    log.debug("Slack", { meeting: meetingURL });
    return res.end(meetingURL);
  }
  return res.end("`Wrong signature` - Verification failed!");
});

// not match any of page before, so 404 not found
app.get("*", function (req, res) {
  res.sendFile(views.notFound);
});

// ####################################################
// NGROK
// ####################################################

async function ngrokStart() {
  try {
    await ngrok.authtoken(config.ngrokAuthToken);
    await ngrok.connect(config.listenPort);
    let api = ngrok.getApi();
    let data = await api.listTunnels();
    let pu0 = data.tunnels[0].public_url;
    let pu1 = data.tunnels[1].public_url;
    let tunnel = pu0.startsWith("https") ? pu0 : pu1;
    log.info("Listening on", {
      node_version: process.versions.node,
      hostConfig: hostCfg,
      announced_ip: announcedIP,
      server: host,
      server_tunnel: tunnel,
      api_docs: api_docs,
      mediasoup_server_version: mediasoup.version,
      mediasoup_client_version: mediasoupClient.version,
      sentry_enabled: sentryEnabled,
    });
  } catch (err) {
    log.error("Ngrok Start error: ", err.body);
    process.exit(1);
  }
}

// ####################################################
// START SERVER
// ####################################################

httpsServer.listen(config.listenPort, () => {
  //log.log(
  //   `%c
  // ███████╗██╗ ██████╗ ███╗   ██╗      ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗
  // ██╔════╝██║██╔════╝ ████╗  ██║      ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
  // ███████╗██║██║  ███╗██╔██╗ ██║█████╗███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
  // ╚════██║██║██║   ██║██║╚██╗██║╚════╝╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
  // ███████║██║╚██████╔╝██║ ╚████║      ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
  // ╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝      ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝ started...
  //`,
  //      'font-family:monospace',
  //  );
  //  if (config.ngrokAuthToken !== '') {
  //      return ngrokStart();
  //  }
  //  log.debug('Settings', {
  //      node_version: process.versions.node,
  //      hostConfig: hostCfg,
  //      announced_ip: announcedIP,
  //      server: host,
  //      api_docs: api_docs,
  //      mediasoup_server_version: mediasoup.version,
  //      mediasoup_client_version: mediasoupClient.version,
  //      sentry_enabled: sentryEnabled,
  //  });
});

// ####################################################
// WORKERS
// ####################################################

(async () => {
  try {
    await createWorkers();
  } catch (err) {
    log.error("Create Worker ERR --->", err);
    process.exit(1);
  }
})();

async function createWorkers() {
  let { numWorkers } = config.mediasoup;

  log.debug("WORKERS:", numWorkers);

  for (let i = 0; i < numWorkers; i++) {
    let worker = await mediasoup.createWorker({
      logLevel: config.mediasoup.worker.logLevel,
      logTags: config.mediasoup.worker.logTags,
      rtcMinPort: config.mediasoup.worker.rtcMinPort,
      rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
    });
    worker.on("died", () => {
      log.error(
        "Mediasoup worker died, exiting in 2 seconds... [pid:%d]",
        worker.pid
      );
      setTimeout(() => process.exit(1), 2000);
    });
    workers.push(worker);
  }
}

async function getMediasoupWorker() {
  const worker = workers[nextMediasoupWorkerIdx];
  if (++nextMediasoupWorkerIdx === workers.length) nextMediasoupWorkerIdx = 0;
  return worker;
}

// ####################################################
// SOCKET IO
// ####################################################

vidio.on("connection", (socket) => {
  socket.on("createRoom", async ({ room_id }, callback) => {
    socket.room_id = room_id;

    if (roomList.has(socket.room_id)) {
      callback({ error: "already exists" });
    } else {
      log.debug("Created room", { room_id: socket.room_id });
      let worker = await getMediasoupWorker();
      roomList.set(socket.room_id, new Room(socket.room_id, worker, vidio));
      callback({ room_id: socket.room_id });
    }
  });

  socket.on("getPeerCounts", async ({}, callback) => {
    if (!roomList.has(socket.room_id)) return;

    let peerCounts = roomList.get(socket.room_id).getPeersCount();

    log.debug("Peer counts", { peerCounts: peerCounts });

    callback({ peerCounts: peerCounts });
  });

  socket.on("roomAction", (data) => {
    if (!roomList.has(socket.room_id)) return;

    log.debug("Room action:", data);
    switch (data.action) {
      case "lock":
        if (!roomList.get(socket.room_id).isLocked()) {
          roomList.get(socket.room_id).setLocked(true, data.password);
          roomList
            .get(socket.room_id)
            .broadCast(socket.id, "roomAction", data.action);
        }
        break;
      case "checkPassword":
        let roomData = {
          room: null,
          password: "KO",
        };
        if (data.password == roomList.get(socket.room_id).getPassword()) {
          roomData.room = roomList.get(socket.room_id).toJson();
          roomData.password = "OK";
        }
        roomList
          .get(socket.room_id)
          .sendTo(socket.id, "roomPassword", roomData);
        break;
      case "unlock":
        roomList.get(socket.room_id).setLocked(false);
        roomList
          .get(socket.room_id)
          .broadCast(socket.id, "roomAction", data.action);
        break;
      case "lobbyOn":
        roomList.get(socket.room_id).setLobbyEnabled(true);
        roomList
          .get(socket.room_id)
          .broadCast(socket.id, "roomAction", data.action);
        break;
      case "lobbyOff":
        roomList.get(socket.room_id).setLobbyEnabled(false);
        roomList
          .get(socket.room_id)
          .broadCast(socket.id, "roomAction", data.action);
        break;
    }
    log.debug("Room status", {
      locked: roomList.get(socket.room_id).isLocked(),
      lobby: roomList.get(socket.room_id).isLobbyEnabled(),
    });
  });

  socket.on("roomLobby", (data) => {
    if (!roomList.has(socket.room_id)) return;

    data.room = roomList.get(socket.room_id).toJson();

    log.debug("Room lobby", {
      peer_id: data.peer_id,
      peer_name: data.peer_name,
      peers_id: data.peers_id,
      lobby: data.lobby_status,
      broadcast: data.broadcast,
    });

    if (data.peers_id && data.broadcast) {
      for (let peer_id in data.peers_id) {
        roomList
          .get(socket.room_id)
          .sendTo(data.peers_id[peer_id], "roomLobby", data);
      }
    } else {
      roomList.get(socket.room_id).sendTo(data.peer_id, "roomLobby", data);
    }
  });

  socket.on("peerAction", (data) => {
    if (!roomList.has(socket.room_id)) return;

    log.debug("Peer action", data);

    if (data.broadcast) {
      roomList.get(socket.room_id).broadCast(data.peer_id, "peerAction", data);
    } else {
      roomList.get(socket.room_id).sendTo(data.peer_id, "peerAction", data);
    }
  });

  socket.on("updatePeerInfo", (data) => {
    if (!roomList.has(socket.room_id)) return;

    // update my peer_info status to all in the room
    roomList.get(socket.room_id).getPeers().get(socket.id).updatePeerInfo(data);
    roomList.get(socket.room_id).broadCast(socket.id, "updatePeerInfo", data);
  });

  socket.on("fileInfo", (data) => {
    if (!roomList.has(socket.room_id)) return;

    log.debug("Send File Info", data);
    if (data.broadcast) {
      roomList.get(socket.room_id).broadCast(socket.id, "fileInfo", data);
    } else {
      roomList.get(socket.room_id).sendTo(data.peer_id, "fileInfo", data);
    }
  });

  socket.on("file", (data) => {
    if (!roomList.has(socket.room_id)) return;

    if (data.broadcast) {
      roomList.get(socket.room_id).broadCast(socket.id, "file", data);
    } else {
      roomList.get(socket.room_id).sendTo(data.peer_id, "file", data);
    }
  });

  socket.on("fileAbort", (data) => {
    if (!roomList.has(socket.room_id)) return;

    roomList.get(socket.room_id).broadCast(socket.id, "fileAbort", data);
  });

  socket.on("shareVideoAction", (data) => {
    if (!roomList.has(socket.room_id)) return;

    log.debug("Share video: ", data);
    if (data.peer_id == "all") {
      roomList
        .get(socket.room_id)
        .broadCast(socket.id, "shareVideoAction", data);
    } else {
      roomList
        .get(socket.room_id)
        .sendTo(data.peer_id, "shareVideoAction", data);
    }
  });

  socket.on("wbCanvasToJson", (data) => {
    if (!roomList.has(socket.room_id)) return;

    // let objLength = bytesToSize(Object.keys(data).length);
    // log.debug('Send Whiteboard canvas JSON', { length: objLength });
    roomList.get(socket.room_id).broadCast(socket.id, "wbCanvasToJson", data);
  });

  socket.on("whiteboardAction", (data) => {
    if (!roomList.has(socket.room_id)) return;

    log.debug("Whiteboard", data);
    roomList.get(socket.room_id).broadCast(socket.id, "whiteboardAction", data);
  });

  socket.on("setVideoOff", (data) => {
    if (!roomList.has(socket.room_id)) return;

    log.debug("Video off", getPeerName());
    roomList.get(socket.room_id).broadCast(socket.id, "setVideoOff", data);
  });

  socket.on("join", (data, cb) => {
    if (!roomList.has(socket.room_id)) {
      return cb({
        error: "Room does not exist",
      });
    }

    log.debug("User joined", data);
    roomList.get(socket.room_id).addPeer(new Peer(socket.id, data));

    if (roomList.get(socket.room_id).isLocked()) {
      log.debug("User rejected because room is locked");
      return cb("isLocked");
    }

    if (roomList.get(socket.room_id).isLobbyEnabled()) {
      log.debug("User waiting to join room because lobby is enabled");
      roomList.get(socket.room_id).broadCast(socket.id, "roomLobby", {
        peer_id: data.peer_info.peer_id,
        peer_name: data.peer_info.peer_name,
        lobby_status: "waiting",
      });
      return cb("isLobby");
    }

    cb(roomList.get(socket.room_id).toJson());
  });

  socket.on("getRouterRtpCapabilities", (_, callback) => {
    if (!roomList.has(socket.room_id)) {
      return callback({ error: "Room not found" });
    }

    log.debug("Get RouterRtpCapabilities", getPeerName());
    try {
      callback(roomList.get(socket.room_id).getRtpCapabilities());
    } catch (err) {
      callback({
        error: err.message,
      });
    }
  });

  socket.on("getProducers", () => {
    if (!roomList.has(socket.room_id)) return;

    log.debug("Get producers", getPeerName());

    // send all the current producer to newly joined member
    let producerList = roomList.get(socket.room_id).getProducerListForPeer();

    socket.emit("newProducers", producerList);
  });

  socket.on("createWebRtcTransport", async (_, callback) => {
    if (!roomList.has(socket.room_id)) {
      return callback({ error: "Room not found" });
    }

    log.debug("Create webrtc transport", getPeerName());
    try {
      const { params } = await roomList
        .get(socket.room_id)
        .createWebRtcTransport(socket.id);
      callback(params);
    } catch (err) {
      log.error("Create WebRtc Transport error: ", err.message);
      callback({
        error: err.message,
      });
    }
  });

  socket.on(
    "connectTransport",
    async ({ transport_id, dtlsParameters }, callback) => {
      if (!roomList.has(socket.room_id)) {
        return callback({ error: "Room not found" });
      }

      log.debug("Connect transport", getPeerName());

      await roomList
        .get(socket.room_id)
        .connectPeerTransport(socket.id, transport_id, dtlsParameters);

      callback("success");
    }
  );

  socket.on(
    "produce",
    async ({ producerTransportId, kind, appData, rtpParameters }, callback) => {
      if (!roomList.has(socket.room_id)) {
        return callback({ error: "Room not found" });
      }

      let peer_name = getPeerName(false);

      // peer_info audio Or video ON
      let data = {
        peer_name: peer_name,
        peer_id: socket.id,
        kind: kind,
        type: appData.mediaType,
        status: true,
      };
      await roomList
        .get(socket.room_id)
        .getPeers()
        .get(socket.id)
        .updatePeerInfo(data);

      let producer_id = await roomList
        .get(socket.room_id)
        .produce(
          socket.id,
          producerTransportId,
          rtpParameters,
          kind,
          appData.mediaType
        );

      log.debug("Produce", {
        kind: kind,
        type: appData.mediaType,
        peer_name: peer_name,
        peer_id: socket.id,
        producer_id: producer_id,
      });

      // add & monitor producer audio level
      if (kind === "audio") {
        roomList
          .get(socket.room_id)
          .addProducerToAudioLevelObserver({ producerId: producer_id });
      }

      callback({
        producer_id,
      });
    }
  );

  socket.on(
    "consume",
    async ({ consumerTransportId, producerId, rtpCapabilities }, callback) => {
      if (!roomList.has(socket.room_id)) {
        return callback({ error: "Room not found" });
      }

      let params = await roomList
        .get(socket.room_id)
        .consume(socket.id, consumerTransportId, producerId, rtpCapabilities);

      log.debug("Consuming", {
        peer_name: getPeerName(false),
        producer_id: producerId,
        consumer_id: params ? params.id : undefined,
      });

      callback(params);
    }
  );

  socket.on("producerClosed", (data) => {
    if (!roomList.has(socket.room_id)) return;

    log.debug("Producer close", data);

    // peer_info audio Or video OFF
    roomList.get(socket.room_id).getPeers().get(socket.id).updatePeerInfo(data);
    roomList.get(socket.room_id).closeProducer(socket.id, data.producer_id);
  });

  socket.on("resume", async (_, callback) => {
    await consumer.resume();
    callback();
  });

  socket.on("getRoomInfo", (_, cb) => {
    if (!roomList.has(socket.room_id)) return;

    log.debug("Send Room Info to", getPeerName());
    cb(roomList.get(socket.room_id).toJson());
  });

  socket.on("refreshParticipantsCount", () => {
    if (!roomList.has(socket.room_id)) return;

    let data = {
      room_id: socket.room_id,
      peer_counts: roomList.get(socket.room_id).getPeers().size,
    };
    log.debug("Refresh Participants count", data);
    roomList
      .get(socket.room_id)
      .broadCast(socket.id, "refreshParticipantsCount", data);
  });

  socket.on("message", (data) => {
    if (!roomList.has(socket.room_id)) return;

    log.debug("message", data);
    if (data.to_peer_id == "all") {
      roomList.get(socket.room_id).broadCast(socket.id, "message", data);
    } else {
      roomList.get(socket.room_id).sendTo(data.to_peer_id, "message", data);
    }
  });

  socket.on("disconnect", async () => {
    if (!roomList.has(socket.room_id)) return;

    log.debug("Disconnect", getPeerName());
    //console.log(socket.room_id);
    //console.log(socket.id);
    // console.log(getPeerName().peer_name)
    let user_id = await User.findByUsername(getPeerName().peer_name);
    // console.log(user_id);
    user_id = user_id[0][0].user_id;
    console.log(`User: ${user_id} Disconnected`);
    await User.setUserCallStatus(user_id, 0);
    let iscurrentpoolempty = await User.isCurrentPoolEmpty(socket.room_id);
    iscurrentpoolempty = iscurrentpoolempty[0][0];
    // console.log(iscurrentpoolempty);
    if (!iscurrentpoolempty) {
      await Pool.setActiveStatusOfPool(socket.room_id, 0);
      //     console.log(`Isactive status of ${socket.room_id} set to 0`);
    }
    roomList.get(socket.room_id).removePeer(socket.id);

    if (roomList.get(socket.room_id).getPeers().size === 0) {
      if (roomList.get(socket.room_id).isLocked()) {
        roomList.get(socket.room_id).setLocked(false);
      }
      if (roomList.get(socket.room_id).isLobbyEnabled()) {
        roomList.get(socket.room_id).setLobbyEnabled(false);
      }
    }

    roomList
      .get(socket.room_id)
      .broadCast(socket.id, "removeMe", removeMeData());

    removeIP(socket);
  });

  socket.on("exitRoom", async (_, callback) => {
    if (!roomList.has(socket.room_id)) {
      return callback({
        error: "Not currently in a room",
      });
    }
    log.debug("Exit room", getPeerName());

    // close transports
    await roomList.get(socket.room_id).removePeer(socket.id);

    roomList
      .get(socket.room_id)
      .broadCast(socket.id, "removeMe", removeMeData());

    if (roomList.get(socket.room_id).getPeers().size === 0) {
      roomList.delete(socket.room_id);
    }

    socket.room_id = null;

    removeIP(socket);

    callback("Successfully exited room");
  });

  // common
  function getPeerName(json = true) {
    if (json) {
      return {
        peer_name:
          (roomList.get(socket.room_id) &&
            roomList.get(socket.room_id).getPeers().get(socket.id).peer_info
              .peer_name) ||
          undefined,
      };
    }
    return (
      roomList.get(socket.room_id) &&
      roomList.get(socket.room_id).getPeers().get(socket.id).peer_info.peer_name
    );
  }

  function removeMeData() {
    return {
      room_id: roomList.get(socket.room_id) && socket.room_id,
      peer_id: socket.id,
      peer_counts:
        roomList.get(socket.room_id) &&
        roomList.get(socket.room_id).getPeers().size,
    };
  }

  function bytesToSize(bytes) {
    let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }
});

function getIP(req) {
  return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
}
function allowedIP(ip) {
  return authHost != null && authHost.isAuthorized(ip);
}
function removeIP(socket) {
  if (hostCfg.protected == true) {
    let ip = socket.handshake.address;
    if (ip && allowedIP(ip)) {
      authHost.deleteIP(ip);
      hostCfg.authenticated = false;
      log.debug("Remove IP from auth", { ip: ip });
    }
  }
}
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
