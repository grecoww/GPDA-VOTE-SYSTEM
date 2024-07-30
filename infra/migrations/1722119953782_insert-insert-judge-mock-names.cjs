/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO judge (team_id, name) values (1, 'lucas souza');
    `);
};

exports.down = (pgm) => {
  pgm.sql(``);
};
