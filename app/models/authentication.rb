class Authentication 
	include Mongoid::Document
 	belongs_to :user 
 	    
	field :user_id, :type => Integer
	field :provider, :type => String
	field :uid, :type=> String
	
	  def provider_name  
		    if provider == 'open_id'  
		      "OpenID"  
		    else  
		      provider.titleize  
		    end  
	  end  
end