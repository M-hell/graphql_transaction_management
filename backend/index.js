import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import path from 'path';
import express from "express";
import http from 'http';
import cors from 'cors';
import connectDB from "./db/connectDb.js";
import dotenv from 'dotenv';

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";

import { buildContext } from "graphql-passport";
import { configurePassport } from "./passport/passport.config.js";

import mergedResolvers from './resolvers/index.js';
import mergedTypeDefs from './typeDefs/index.js';
// import job from "./cron.js";
dotenv.config();

configurePassport();

const app = express();
const httpServer = http.createServer(app);
const __dirname = path.resolve();

// job.start(); 



const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
	uri: process.env.MONGODB_URI,
	collection: "sessions",
});
store.on("error", (err) => console.log(err));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false, // this option specifies whether to save the session to the store on every request
		saveUninitialized: false, // option specifies whether to save uninitialized sessions
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7, //1 week
			httpOnly: true, // this option prevents the Cross-Site Scripting (XSS) attacks
		},
		store: store,
	})
);
app.use(passport.initialize());
app.use(passport.session());



const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(
    "/graphql",
	cors(
        {
            origin: process.env.FRONTEND_URL,
		credentials: true,
        }
    ),
	express.json(),
	expressMiddleware(server, {
		context: async ({ req, res }) => buildContext({ req, res }),
  }),
);

// npm run build will build your frontend app, and it will the optimized version of your app
app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});


await connectDB();
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);