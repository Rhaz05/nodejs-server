require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env._PORT || 3050;
const { logger } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { SetMongo } = require("./repository/mogoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");

app.use(logger);

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(bodyParser.json({ limit: "50mb" }));

SetMongo(app);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

/* -------------------------------------------------*/
/*   ____             _            
/*  |  _ \ ___  _   _| |_ ___  ___ 
/*  | |_) / _ \| | | | __/ _ \/ __|
/*  |  _ < (_) | |_| | ||  __/\__ \
/*  |_| \_\___/ \__,_|\__\___||___/
/*                               
/* -------------------------------------------------*/

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./route/root"));

app.use("/access", require("./route/accessRoutes"));

app.use("/auth", require("./route/authRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({
      message: "404 Not Found",
    });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
