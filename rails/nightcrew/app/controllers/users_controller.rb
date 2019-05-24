class UsersController < ApplicationController

  skip_before_action :verify_authenticity_token

  def show
  end

  def create
    # Get JSON auth_info data from the request
    auth_info = ActiveSupport::JSON.decode(request.body.read)
    user = User.create_from_fb(auth_info)
    session = Session.create(user_id: user.id, uid: user.uid, oauth_token: user.oauth_token)
    render :json => ActiveSupport::JSON.encode({nightcrew_token: session.nightcrew_token, user: user})
  end

  def update
  end

  def exists
    User.does_user_exist_by_uid(params[:uid]) ? res = ActiveSupport::JSON.encode({user_exists: true}) : res = ActiveSupport::JSON.encode({user_exists: false})
    render :json => res
  end

  def checkins
    if valid_session?(params[:id])
      checkins = Checkin.where(user_id: params[:id])
      @checkins_arr = []
      checkins.each do |checkin|
        @checkins_arr << checkin.place_id
      end
      render :json => ActiveSupport::JSON.encode({ places: @checkins_arr })
    else
      render_denial
    end
  end

  def create_guestlist_request
    user = User.where(id: params[:id]).first
    data = ActiveSupport::JSON.decode(request.body.read)
    # TODO: this var is not used anywhere
    # date = data["date"]
    place_id = data['place_id']
    place = Place.where(id: place_id).first
    PlaceMailer.request_guestlist(user, place)
    Req.create(user_id:user.id, place_id:place_id)
    render :json => ActiveSupport::JSON.encode({}) 
  end

  def friend_checkins
    if valid_session?(params[:id])
      user = User.where(id: params[:id]).first
      user.update_friendships
      render :json => ActiveSupport::JSON.encode({places: user.get_friends_checkins})
    else
      render_denial
    end
  end

end
