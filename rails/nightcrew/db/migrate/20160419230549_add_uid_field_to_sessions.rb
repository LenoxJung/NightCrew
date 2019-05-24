class AddUidFieldToSessions < ActiveRecord::Migration
  def change
    add_column :sessions, :uid, :string
  end
end
