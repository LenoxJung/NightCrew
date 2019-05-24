class User < ActiveRecord::Base

  has_many :requested_places, through: :reqs, class_name: 'Place'
  has_many :reqs
  has_many :checked_in_places, through: :checkins, class_name: 'Place'
  has_many :checkins
  has_many :friendships
  has_many :friends, through: :friendships
  has_many :inverse_friendships, class_name: 'Friendship', foreign_key: :friend_id
  has_many :inverse_friends, through: :inverse_friendships, source: :user
  has_many :sessions
  has_many :events
  has_many :invited_events, through: :invitations, class_name: 'Event'
  has_many :invitations
  has_many :favorites
  has_many :notifications
  has_many :favorite_places, through: :favorites, class_name: 'Place'

  # Returns a hash, each key is the place id, each value is an array of User objects
  def get_friends_checkins
    # Get array of friend ids
    friend_ids = friendships.map { |friendship| friendship.friend_id }
    # Select checkins where each friend_id matches with the user_id in each checkin
    friend_checkins_arr = Checkin.all.select { |checkin| friend_ids.include? checkin.user_id }
    # Init the hash - key is place id, value is array of user objects
    hash = {}
    friend_checkins_arr.each do |checkin|
      place_id = checkin.place_id.to_s.to_sym
      # if place is already recorded, then append a user object to the array, else (if place isn't recorded yet), create a record with the user
      hash[place_id] ? hash[place_id] << User.where(id: checkin.user_id).first : hash[place_id] = [User.where(id: checkin.user_id).first]
    end
    hash
  end

  def update_friendships
    require 'net/http'
    request_url = "https://graph.facebook.com/v2.6/me?access_token=#{oauth_token}&fields=friends"
    raw_response = Net::HTTP.get(URI.parse(request_url))
    response = ActiveSupport::JSON.decode(raw_response)
    friends_arr = response['friends']['data']
    db_friends = Friendship.where(user_id: id)
    fb_ids = db_friends.map{ |user| user.friend_fb_id }
    new_friends = friends_arr.reject{ |user| fb_ids.include? user['id'] }
    # For difference in friends, create a new friendship
    new_friends.each do |friend|
      friend_user = User.where(uid: friend['id']).first
      Friendship.create(user_id: id, friend_id: friend_user.id, user_fb_id: uid, friend_fb_id: friend_user.uid) if friend_user
    end
  end

  def self.does_user_exist_by_uid(fb_id)
    res = User.where(uid: fb_id)
    res.length > 0
  end

  def self.create_from_fb(auth_info)
    require 'net/http'
    request_url = "https://graph.facebook.com/v2.6/me?access_token=#{auth_info['token']}&fields=first_name,last_name,email,gender,picture,friends"
    response = Net::HTTP.get(URI.parse(request_url))
    additional_data = ActiveSupport::JSON.decode(response)
    @user = User.create(uid: auth_info['fb_id'],
                oauth_token: auth_info['token'],
                oauth_expires_at: auth_info['expiry'],
                firstname: additional_data['first_name'],
                lastname: additional_data['last_name'],
                email: additional_data['email'],
                phone: auth_info['phone'],
                gender: additional_data['gender'],
                picture: additional_data['picture']['data']['url'],
                dob: auth_info['dob'])
    # Create friendships from array of friends
    additional_data['friends']['data'].each do |friend|
      friend_user = User.where(uid: friend['id'])
      Friendship.create(user_id: @user.id, friend_id: friend_user[0].id) if friend_user.length > 0
    end
    # Return the newly created user
    @user
  end

end
