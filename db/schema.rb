# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20091007093419) do

  create_table "attributes", :force => true do |t|
    t.integer  "taggable_id"
    t.string   "name"
    t.string   "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "dynamic_type_attributes", :force => true do |t|
    t.string   "type_name"
    t.string   "attribute_name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "dynamic_type_scopes", :force => true do |t|
    t.string   "type_name"
    t.string   "type_scope"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "dynamic_types", :force => true do |t|
    t.string   "name"
    t.string   "super_type"
    t.string   "surrogate_class"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "taggables", :force => true do |t|
    t.string   "type"
    t.integer  "origin"
    t.integer  "tip"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
