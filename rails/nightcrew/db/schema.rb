# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160503052705) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "checkins", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "place_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "checkins", ["place_id"], name: "index_checkins_on_place_id", using: :btree
  add_index "checkins", ["user_id"], name: "index_checkins_on_user_id", using: :btree

  create_table "events", force: :cascade do |t|
    t.datetime "occuring_at"
    t.integer  "place_id"
    t.integer  "user_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "events", ["place_id"], name: "index_events_on_place_id", using: :btree
  add_index "events", ["user_id"], name: "index_events_on_user_id", using: :btree

  create_table "favorites", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "place_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "favorites", ["place_id"], name: "index_favorites_on_place_id", using: :btree
  add_index "favorites", ["user_id"], name: "index_favorites_on_user_id", using: :btree

  create_table "friendships", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "friend_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.string   "user_fb_id"
    t.string   "friend_fb_id"
  end

  create_table "invitations", force: :cascade do |t|
    t.integer  "event_id"
    t.integer  "user_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.integer  "status",     default: 0
  end

  add_index "invitations", ["event_id"], name: "index_invitations_on_event_id", using: :btree
  add_index "invitations", ["user_id"], name: "index_invitations_on_user_id", using: :btree

  create_table "notifications", force: :cascade do |t|
    t.integer  "user_id"
    t.boolean  "viewed"
    t.string   "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "notifications", ["user_id"], name: "index_notifications_on_user_id", using: :btree

  create_table "places", force: :cascade do |t|
    t.string  "name"
    t.string  "address"
    t.string  "lat"
    t.boolean "guestlist"
    t.boolean "vip"
    t.string  "lng"
    t.string  "picture"
    t.string  "email"
  end

  create_table "reqs", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "place_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "reqs", ["place_id"], name: "index_reqs_on_place_id", using: :btree
  add_index "reqs", ["user_id"], name: "index_reqs_on_user_id", using: :btree

  create_table "sessions", force: :cascade do |t|
    t.integer  "user_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "uid"
    t.string   "oauth_token"
    t.string   "nightcrew_token"
  end

  add_index "sessions", ["user_id"], name: "index_sessions_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "uid"
    t.string   "oauth_token"
    t.datetime "oauth_expires_at"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.string   "firstname"
    t.string   "lastname"
    t.string   "email"
    t.string   "gender"
    t.string   "phone"
    t.string   "picture"
    t.string   "dob"
    t.string   "apn_token"
  end

  add_foreign_key "checkins", "places"
  add_foreign_key "checkins", "users"
  add_foreign_key "events", "places"
  add_foreign_key "events", "users"
  add_foreign_key "favorites", "places"
  add_foreign_key "favorites", "users"
  add_foreign_key "invitations", "events"
  add_foreign_key "invitations", "users"
  add_foreign_key "notifications", "users"
  add_foreign_key "reqs", "places"
  add_foreign_key "reqs", "users"
  add_foreign_key "sessions", "users"
end
