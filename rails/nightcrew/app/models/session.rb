class Session < ActiveRecord::Base

  belongs_to :user

  validates :user_id, presence: true, numericality: { only_integer: true }
  validates :uid, presence: true
  validates :oauth_token, presence: true

  after_create :generate_nightcrew_token

  protected

  def generate_nightcrew_token
    self.nightcrew_token = BCrypt::Password.create(id.to_s << user_id.to_s << oauth_token).to_s
    save
  end

end
