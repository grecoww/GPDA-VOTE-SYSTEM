/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO teams (team_id, team_name) values ('1', 'GPDA');
    `);
};

exports.down = (pgm) => {
  pgm.sql(``);
};
