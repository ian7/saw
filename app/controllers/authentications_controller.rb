class AuthenticationsController < ApplicationController

  def index
  	@authentications = current_user.authentications if current_user  
  end

  def create
	  omniauth = request.env["omniauth.auth"]  
	  authentication = Authentication.find :first, :conditions=>{ :provider=>omniauth["provider"], :uid=>omniauth["uid"]}
	  if authentication  
	    flash[:notice] = "Signed in successfully."  
	    sign_in_and_redirect(:user, authentication.user)  
	  elsif current_user  
	    current_user.authentications.create(:provider => omniauth['provider'], :uid => omniauth['uid'])  
	    flash[:notice] = "Authentication successful."  
	    redirect_to authentications_url  
	  else  
	    user = User.new  
	    user.apply_omniauth( omniauth )
	    #user.authentications.build(:provider => omniauth['provider'], :uid => omniauth['uid'])  
	    user.save!  
	    flash[:notice] = "Signed in successfully."  
	    sign_in_and_redirect(:user, user)  
	  end  
  end
  
 def destroy  
	  @authentication = current_user.authentications.find(params[:id])  
	  @authentication.destroy  
	  flash[:notice] = "Successfully destroyed authentication."  
	  redirect_to authentications_url  
	end  
end
