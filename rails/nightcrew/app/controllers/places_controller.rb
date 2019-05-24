class PlacesController < ApplicationController

  skip_before_action :verify_authenticity_token

  def index
    render :json => { :places => Place.all }  
  end

  def show
  end

  # JSON containing user_id is posted to endpoint
  def checkin
    post_data = ActiveSupport::JSON.decode(request.body.read)
    if valid_session?(post_data['user_id'])
      place = Place.where(id: params[:id]).first
      existing_checkin = Checkin.where(place_id: place.id, user_id: post_data['user_id'])
      # Check to see if user already checked in
      if existing_checkin.length == 0
        Checkin.create(place_id: place.id, user_id: post_data['user_id'])
        render :json => ActiveSupport::JSON.encode({ checkedin: true })
      else
        render :json => ActiveSupport::JSON.encode({ checkedin: false })
      end
    else
      render_denial
    end
  end

  # JSON containing user_id is posted
  def checkout
    json_data = ActiveSupport::JSON.decode(request.body.read)
    if valid_session?(json_data['user_id'])
      place = Place.where(id: params[:id]).first
      @existing_checkin = Checkin.where(place_id: place.id, user_id: json_data['user_id'])
      # Check to see if checkin exists, if 0, then don't do anything
      if @existing_checkin.length == 0
        render :json => ActiveSupport::JSON.encode({ checkedout: false })
      else
        @existing_checkin.first.destroy
        render :json => ActiveSupport::JSON.encode({ checkedout: true })
      end
    else
      render_denial
    end
  end

end
