const { ApolloServer } = require("apollo-server");
const {
  makeRemoteExecutableSchema,
  introspectSchema,
  mergeSchemas
} = require("graphql-tools");
const { createHttpLink } = require("apollo-link-http");

const { fetch } = require("cross-fetch");

(async () => {
  const createApiLinkFromUri = async uri => {
    const apiLink = createHttpLink({
      uri,
      fetch
    });

    const schema = await introspectSchema(apiLink);
    return makeRemoteExecutableSchema({
      schema,
      link: apiLink
    });
  };

  const beerSchema = await createApiLinkFromUri(
    "https://beer-app-mauve.now.sh/graphql"
  );
  const pokemonSchema = await createApiLinkFromUri(
    "https://graphql-pokemon.now.sh/"
  );
  const schema = mergeSchemas({
    schemas: [beerSchema, pokemonSchema]
  });
  const server = new ApolloServer({
    schema
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
