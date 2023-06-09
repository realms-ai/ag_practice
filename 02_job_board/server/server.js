import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4'
import cors from 'cors';
import express from 'express';
import { readFile } from 'node:fs/promises';
import { authMiddleware, handleLogin } from './auth.js';
import { resolvers } from './resolver.js';
import { getUser } from './db/users.js';

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.get("/", (req, res) => {
  res.send("<h1>Job <strong>Board</strong> Home Page!</h1>");
});

app.post('/login', handleLogin);

const getContext = async({req}) => {
  console.log("[getContext] req.body: ", req.body)
  console.log("[getContext] req.headers: ", req.headers)
  console.log("[getContext] req.auth: ", req.auth)
  let user
  if(req.auth) {
    user = await getUser(req.auth.sub);
  }
  return { auth: req.auth, user: user, weather: 'sunny' };
}

const typeDefs = await readFile('./schema.graphql', 'utf-8')

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
app.use('/graphql', apolloMiddleware(apolloServer, {context: getContext}));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`)
});
