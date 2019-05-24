class RemoveIsClubFromPlaces < ActiveRecord::Migration
  def change
    remove_column :places, :is_club, :boolean
  end
end
