export const getInstanceInfo = async (req) => {
    return {
      dbConfig: {
        user: 'dbuser',
        host: 'localhost',
        database: 'dbname',
        password: 'dbpassword',
        port: 5432,
      },
    };
  };