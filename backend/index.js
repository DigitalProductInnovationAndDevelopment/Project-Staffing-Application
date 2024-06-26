import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import config from "config";
import csrf from "@dr.pogodin/csurf";
import cookieParser from "cookie-parser";
import NodeCache from "node-cache";


// import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import projectRoutes from "./routes/project.js";


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); // set directory of where to store our assets (i.e. images) (in this case locally)
app.use(cors());
app.use(cookieParser());

/*
set-up a cache for storing session data using the node-cache module
- stdTTL = Standard Time-To-Live = sets the default TTL (in seconds) for each cache entry
- keys (sessions) get stored for 90 min (defined in config) and deletion is done every 2 min, holds up to 1million entries
*/
export const sessionCache = new NodeCache({stdTTL: config.get('sessionExpiresIn') * 60, checkperiod: 120});

/* MIDDLEWARE */
//cors
app.use(cors({origin: await config.get('origin'), credentials: true,}));
//csrf
app.use(csrf({cookie: {httpOnly: true}}));
app.use((req, res, next) => {
  res.cookie('X-XSRF-TOKEN', req.csrfToken());
  next();
});


/* ROUTES */
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/project", projectRoutes);
//home route (remove later)
app.get('/', (req, res) => {
  res.send('Hello World! This is the GREAT STAFF server!');
});

/* UNKNOWN ROUTES */
app.all('*', (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

/* GLOBAL ERROR HANDLING */
app.use((err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async() => {
    //list current database collections
    const db = mongoose.connection.client.db();
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);
    console.log('current database collections (tables):', collectionNames);
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));