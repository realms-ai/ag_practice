# GraphQL Job Board

This is a project used in the [GraphQL by Example](https://www.udemy.com/course/graphql-by-example/?referralCode=7ACEB04674F000BAC061) course.

It uses Apollo Server with Express, and GraphQL-Request and Apollo Client as GraphQL clients. The application is used to explain queries, mutations, custom object types, authentication, etc.

## Packages to Install
[Apollo Docs](https://www.apollographql.com/docs/)
[Link](https://www.apollographql.com/docs/apollo-server/workflow/generate-types/)
1. [Plugins](https://the-guild.dev/graphql/codegen/plugins)
   - Typescript
     - Check **TypeName** in there to remove typename from schema generated
   - Typescript-Resolvers
     - Check **mappers** in there for config
2. Run **codegen** command in watch mode OR Run it *concurrently* with the **start** command

### Server

```
yarn add -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-resolvers
```

```
npx graphql-code-generator init
yarn run codegen
```
- Run the above command to generate the *schema.ts* file and 

#### Output
```
? What type of application are you building? Backend - API or server
? Where is your schema?: (path or url) ./schema.graphql
? Pick plugins: TypeScript (required by other typescript plugins), TypeScript Resolvers (strongly
 typed resolve functions)
? Where to write the output: src/generated/schema.ts
? Do you want to generate an introspection file? No
? How to name the config file? codegen.json
? What script in package.json should run the codegen? codegen
```

### Client

Commands to run

```
yarn add -D @graphql-codegen/cli @graphql-codegen/client-preset concurrently
```

```
npx graphql-code-generator init
yarn run codegen
```
- **client-preset** plugin graphql