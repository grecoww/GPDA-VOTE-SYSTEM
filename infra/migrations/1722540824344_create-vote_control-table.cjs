/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE vote_control (
      name VARCHAR(100) NOT NULL UNIQUE,
      team_1 INTEGER DEFAULT 0,
      team_2 INTEGER DEFAULT 0,
      team_3 INTEGER DEFAULT 0,
      team_4 INTEGER DEFAULT 0,
      team_5 INTEGER DEFAULT 0,
      team_6 INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE vote-control;
  `);
};
