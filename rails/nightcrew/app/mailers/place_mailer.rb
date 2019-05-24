class PlaceMailer < ApplicationMailer

  def request_guestlist(user, place)
    mail(to: place.email, subject: 'Guestlist Request', from: user.email)
  end

end
