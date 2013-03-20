class NotifyController < ApplicationController
  alias :super_notify :notify

  def notify
  	
  	h = {}
  	h[:id] = params[:id]
  	h[:event] = params[:event]

=begin
  	if current_user 
  		h[:user] = current_user.email
  	end
=end

  	#Juggernaut.publish 'channel1', h.to_json.to_s
    super_notify( params[:id], 0, params[:event],'notify', params[:attribute] )
  	render :nothing => true
  end
  def stamped
    h = []
    Taggable.where(:updated_at.gt=>params[:stamp].to_i).each{ |t| 
      h << t.id
    }

    render :json => h.to_json
  end
end
