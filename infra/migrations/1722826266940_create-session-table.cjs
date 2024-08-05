/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE session (
      sid VARCHAR NOT NULL,
      sess JSON NOT NULL,
      expire TIMESTAMP(6) NOT NULL
    );
  `);

  pgm.sql(`
    ALTER TABLE session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;
  `);

  pgm.sql(`
    CREATE INDEX IDX_session_expire ON session (expire);
  `);
};

exports.down = (pgm) => {};
