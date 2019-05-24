class AddIsClubFieldToPlaces < ActiveRecord::Migration
  def change
    add_column :places, :is_club, :boolean
  end
end
