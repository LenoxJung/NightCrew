class RemoveLongFromPlaces < ActiveRecord::Migration
  def change
    remove_column :places, :long, :string
  end
end
