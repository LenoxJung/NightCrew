class CreatePlaces < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.string :name
      t.string :address
      t.string :long
      t.string :lat
      t.boolean :guestlist
      t.boolean :vip
    end
  end
end
