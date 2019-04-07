import { ApolloServer, gql } from 'apollo-server-express'
import { getUser } from 'meteor/apollo'

import {typeDefs, resolvers} from '/imports/api/graphql/schema';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({
    user: await getUser(req.headers.authorization)
  })
});