class CustomFailure < Devise::FailureApp
  def redirect_url
    puts 'asdfasdfasdfasdfasdfasfsfsd'
    'users#login_failed'
    #puts '!!!!!!!!!!!!!!!!!!!!!!!hey'
    #return super unless [:worker, :employer, :user].include?(scope) #make it specific to a scope
#     new_user_session_url(:subdomain => 'secure')
  end

  # You need to override respond to eliminate recall
  def respond
    if http_auth?
      http_auth
    else
      redirect_to '/users/login_failed'
    end
  end
end