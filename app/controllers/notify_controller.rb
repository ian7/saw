class NotifyController < ApplicationController
  def notify
  	
  	h = {}
  	h[:id] = params[:id]
  	h[:event] = params[:event]

  	if current_user 
  		h[:user] = current_user.email
  	end

  	Juggernaut.publish 'channel1', h.to_json.to_s
  	render :nothing => true
  end
end
