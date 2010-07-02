class CreateTaggables < ActiveRecord::Migration
  def self.up
    create_table :taggables do |t|
      t.integer :id
      t.string  :type
      t.integer :origin
      t.integer :tip
      t.string  :name

      t.timestamps
    end
  end

  def self.down
    drop_table :taggables
  end
end
