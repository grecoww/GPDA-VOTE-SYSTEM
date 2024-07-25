/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE member (
      id VARCHAR(60) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      question_1.1 INTEGER,
      question_1.2 INTEGER,
      question_1.3 INTEGER,
      question_1.4 INTEGER,
      question_1.5 INTEGER,
      question_1.6 INTEGER,
      question_1.7 INTEGER,
      question_2.1 INTEGER,
      question_2.2 INTEGER,
      question_2.3 INTEGER,
      question_2.4 INTEGER,
      question_2.5 INTEGER,
      question_2.6 INTEGER,
      question_2.7 INTEGER,
      question_2.8 INTEGER,
      question_3.1 INTEGER,
      question_3.2 INTEGER,
      question_3.3 INTEGER,
      question_3.4 INTEGER,
      question_3.5 INTEGER,
      question_3.6 INTEGER,
      question_3.7 INTEGER,
      question_3.8 INTEGER,
      question_3.9 INTEGER,
      question_3.10 INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE member;
  `);
};
