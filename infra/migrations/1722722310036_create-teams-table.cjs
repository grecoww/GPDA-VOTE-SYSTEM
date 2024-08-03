/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE teams (
      team_id INTEGER NOT NULL UNIQUE,
      team_name VARCHAR(100) NOT NULL UNIQUE
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE teams;
  `);
};
