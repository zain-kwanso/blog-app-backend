//type declaration
const config = {
    development: {
        username: "postgres",
        password: "123",
        database: "testdb",
        host: "127.0.0.1",
        dialect: "postgres",
    },
    test: {
        username: "root",
        password: null,
        database: "database_test",
        host: "127.0.0.1",
        dialect: "postgres",
    },
    production: {
        username: "postgres",
        password: "123",
        database: process.env.POSTGRES_URL,
        host: "127.0.0.1",
        dialect: "postgres",
    },
};
export default config;
