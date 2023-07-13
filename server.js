import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import db from "./models/index.js";
import * as AdminJSSequelize from "@adminjs/sequelize";
import session from "express-session";
import Connect from "connect-pg-simple";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://everymansenglish.com",
      "http://localhost:3001",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Importing routes
import students from "./routes/student.route.js";
import tutors from "./routes/tutor.route.js";

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "build")));
app.use("/api/students", students);
app.use("/api/tutors", tutors);

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

const studentResource = {
  resource: db.students,
  options: {
    properties: {
      username: { isVisible: { list: true, show: true, edit: true } },
      email: { isVisible: { list: true, show: true, edit: true } },
      phone: { isVisible: { list: true, show: true, edit: true } },
      why: { isVisible: { list: true, show: true, edit: true } },
    },
  },
};

const tutorResource = {
  resource: db.tutors,
  options: {
    properties: {
      username: { isVisible: { list: true, show: true, edit: true } },
      email: { isVisible: { list: true, show: true, edit: true } },
      phone: { isVisible: { list: true, show: true, edit: true } },
      tell: { isVisible: { list: true, show: true, edit: true } },
    },
  },
};

const DEFAULT_ADMIN = {
  email: "admin@example.com",
  password: "password",
};

const admin = new AdminJS({
  resources: [studentResource, tutorResource],
});

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

const ConnectSession = Connect(session);
const sessionStore = new ConnectSession({
  conObject: {
    connectionString: `postgres://default:XLlMr8OG1ebS@ep-rapid-bush-478334.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require`,
    ssl: process.env.NODE_ENV === "production",
  },
  tableName: "session",
  createTableIfMissing: true,
});

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate,
    cookieName: "adminjs",
    cookiePassword: "sessionsecret",
  },
  null,
  {
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    secret: "sessionsecret",
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: process.env.NODE_ENV === "production",
    },
    name: "adminjs",
  }
);

app.use(admin.options.rootPath, adminRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced DB...");
  })
  .catch((error) => {
    console.log(`Sync Failed: ${error.message}...`);
  });

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}......`);
});
