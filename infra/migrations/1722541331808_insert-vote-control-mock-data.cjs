/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO vote_control (name) values ('lucas souza');
    `);
};

exports.down = (pgm) => {
  pgm.sql(``);
};
