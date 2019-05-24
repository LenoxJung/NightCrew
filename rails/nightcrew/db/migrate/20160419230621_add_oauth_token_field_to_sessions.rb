class AddOauthTokenFieldToSessions < ActiveRecord::Migration
  def change
    add_column :sessions, :oauth_token, :string
  end
end
