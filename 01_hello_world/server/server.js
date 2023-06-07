import {ApolloServer} from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `
    type Query {
        greeting: String
    }
`

const resolvers = {
    Query: {
        greeting: () => 'Hello GraphQL World!'
    },
}


const server = new ApolloServer({typeDefs: typeDefs, resolvers: resolvers})
const {url} = await startStandaloneServer(server, {listen: {port: 9000}})

console.log(`🚀 Server ready at ${url}`)