/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO teams (team_id, team_name) values ('3', 'IEEE');
    `);
};

exports.down = (pgm) => {
  pgm.sql(``);
};
