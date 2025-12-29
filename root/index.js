const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const path = require('path');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { exec } = require('child_process');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const httpServer = createServer(app);
httpServer.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  exec('docker-compose up -d', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error launching Docker: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Docker stderr: ${stderr}`);
      return;
    }
    console.log(`Docker stdout: ${stdout}`);
  });
});