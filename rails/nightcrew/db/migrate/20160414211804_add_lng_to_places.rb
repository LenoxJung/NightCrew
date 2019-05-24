class AddLngToPlaces < ActiveRecord::Migration
  def change
    add_column :places, :lng, :string
  end
end
