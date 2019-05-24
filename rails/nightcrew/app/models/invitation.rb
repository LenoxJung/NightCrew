class Invitation < ActiveRecord::Base
  belongs_to :event
  belongs_to :user
  enum status: { pending: 0, accepted: 1, declined: 2}
end
