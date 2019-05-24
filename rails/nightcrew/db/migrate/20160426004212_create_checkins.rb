class CreateCheckins < ActiveRecord::Migration
  def change
    create_table :checkins do |t|
      t.references :user, index: true, foreign_key: true
      t.references :place, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
