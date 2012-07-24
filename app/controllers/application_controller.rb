# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  
  before_filter :log_username   
  
  helper :all # include all helpers, all the time
  
  logger = Log4r::Logger['saw.default']

  #protect_from_forgery # See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password


 protected
	def log_username
	 	if current_user 
	    	logger.info "Username: " + current_user.email
	    else
	    	logger.info "Username: (none)"
	  	end
	end

	def ring( id , propagation=0, action='', eventClass='notify',distanceBias=0)
		
		begin
			t = Taggable.find id			


			#debugger

			# this is going to set cut-off properly
			if( distanceBias <= propagation )
				if t._type == "Relation" or t._type == "Tagging"
					# in case this is relation then follow it and ring both ends
					notify( id, distanceBias, action, eventClass )
					ring( t.tip, propagation, action, eventClass, distanceBias+1 )
					ring( t.origin, propagation, action, eventClass, distanceBias+1 )
				else
					# otherwise just ring the element (which we already did)
					# we might need to improve that especially for ringing all elements tagged by the tag
					notify( id, distanceBias, action, eventClass )
				end
			end
		rescue Exception => e
			puts "Ring - crashed with id: " + id.to_s
			puts e
		end
	end

	def notify( id, distance=0,action='', eventClass='notify',attribute=nil)
		#feed the old channel. 
    	Juggernaut.publish( "/chats", id )


    	# build a new-channel structure
		h={}
	  	h[:id] = id
	  	h[:distance] = distance
	  	h[:event] = action
	  	h[:class] = eventClass
	  	t = Taggable.find id 
	  	h[:type] = t.type
	  	if( attribute != nil )
	  		h[:attribute] = attribute
	  	end

	  	if current_user 
	  		h[:user] = current_user.email
	  	end

		puts "Notifying " + t.type + " id: " + id.to_s + " with action: " + action + " distance: " + distance.to_s

	  	# feed the new channel
    	Juggernaut.publish('channel1', h.to_json.to_s )
  	end
end
