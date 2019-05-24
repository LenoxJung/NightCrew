class SessionsController < ApplicationController

  skip_before_action :verify_authenticity_token

  def create
    # JSON will be posted to this controller
    # Read the incoming JSON (auth_info)
    auth_info = ActiveSupport::JSON.decode(request.body.read)
    user = User.where(uid: auth_info['fb_id']).first
    session = Session.create(user_id: user.id, uid: user.uid, oauth_token: user.oauth_token)
    render :json => ActiveSupport::JSON.encode({user: user, nightcrew_token: session.nightcrew_token})
  end

  def destroy
    session = Session.find_by(uid: params['id'])
    session.destroy if session
    head :no_content
    # url/sessions/uid
    # METHOD DELETE

  end

  # JSON coming in will be string containing the token
  def verify
    incoming_token = ActiveSupport::JSON.decode(request.body.read)
    session = Session.where(nightcrew_token: incoming_token).first
    response = { valid: false }
    response[:valid] = true if session
    render :json => ActiveSupport::JSON.encode(response)
  end

end
