module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  database: 'gympoint',
  username: 'postgres',
  password: 'docker',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
