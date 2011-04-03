class User
  include Mongoid::Document
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

	has_many :authentications
	
	field :email
	field :role

	 
	ROLES = %w[admin user]
	
	def apply_omniauth(omniauth)  
 	 self.email = omniauth['user_info']['email'] if email.blank?  
  		authentications.build(:provider => omniauth['provider'], :uid => omniauth['uid'])  
end  
end