export default {
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
    database: "practice",
    host: "127.0.0.1",
    dialect: "postgres",
  },
};
