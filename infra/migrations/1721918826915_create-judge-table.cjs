/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE judge (
      team_id VARCHAR(60) NOT NULL,
      name VARCHAR(100) NOT NULL,
      question_1_1 INTEGER DEFAULT 0,
      question_1_2 INTEGER DEFAULT 0,
      question_1_3 INTEGER DEFAULT 0,
      question_2_1 INTEGER DEFAULT 0,
      question_2_2 INTEGER DEFAULT 0,
      question_2_3 INTEGER DEFAULT 0,
      question_3_1 INTEGER DEFAULT 0,
      question_3_2 INTEGER DEFAULT 0,
      question_3_3 INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE judge;
  `);
};
