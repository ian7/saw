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
end
