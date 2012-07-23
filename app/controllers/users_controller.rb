class UsersController < ApplicationController
  def new
  end
	
  def create
  	super  
  	session[:omniauth] = nil unless @user.new_record?   
  end

  def edit
  end

  def login_failed
  end
end
