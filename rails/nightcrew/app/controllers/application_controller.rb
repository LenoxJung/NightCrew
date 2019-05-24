class ApplicationController < ActionController::Base

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.

  protect_from_forgery with: :exception

  protected

  # Reads the HTTP headers for a nightcrew_token in order to verify the session
  def valid_session?(user_id)
    incoming_token = request.headers.env['HTTP_NIGHTCREW_TOKEN']
    Session.where(user_id: user_id, nightcrew_token: incoming_token).first
  end

  def render_denial
    render :json => 'lulz'
  end

  helper_method :valid_session?, :render_denial
    
end
