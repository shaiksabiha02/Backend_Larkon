exports.up = (pgm) => {
  pgm.createTable('emails', {
    id: 'id',
    sender_id: { type: 'integer', notNull: true, references: '"users"', onDelete: 'CASCADE' },
    receiver_id: { type: 'integer', notNull: true, references: '"users"', onDelete: 'CASCADE' },
    subject: { type: 'varchar(255)', notNull: true },
    body: { type: 'text', notNull: true },
    folder: { type: 'varchar(20)', default: 'inbox' },
    is_read: { type: 'boolean', default: false },
    is_starred: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });
  pgm.createIndex('emails', ['receiver_id', 'folder']);
};

exports.down = (pgm) => {
  pgm.dropTable('emails');
};