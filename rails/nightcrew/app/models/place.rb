class Place < ActiveRecord::Base

  has_many :reqs
  has_many :checkins
  has_many :favorites
  has_many :events

end