class AddFbIdFieldsToFriendships < ActiveRecord::Migration
  def change
    add_column :friendships, :user_fb_id, :string
    add_column :friendships, :friend_fb_id, :string
  end
end
