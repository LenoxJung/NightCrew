class AddNightcrewTokenToSessions < ActiveRecord::Migration

  def change
    add_column :sessions, :nightcrew_token, :string
  end

end
