class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.datetime :occuring_at
      t.references :place, index: true, foreign_key: true
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
