class AddPictureFieldToPlaces < ActiveRecord::Migration
  def change
    add_column :places, :picture, :string
  end
end
