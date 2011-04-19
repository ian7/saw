class User
  include Mongoid::Document
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

	has_many :authentications
	has_many :taggables, :foreign_key=>'author_id'

	has_and_belongs_to_many :manages, :class_name=>'Project'
	has_and_belongs_to_many :projects
	
	field :email
	field :role

	 
	ROLES = %w[admin user]
	
	def apply_omniauth(omniauth)  

  case omniauth['provider']
    when 'facebook'
      if (extra = omniauth['extra']['user_hash'] rescue false)
          self.email = (extra['email'] rescue '')
        end
	  else
   	 self.email = omniauth['user_info']['email'] 
    end
  	 if email.blank?  
   		authentications.build(:provider => omniauth['provider'], :uid => omniauth['uid'])  
    end
  end

  def facebook
    @fb_user ||= FbGraph::User.me(self.authentications.find_by_provider('facebook').token)
  end

    
end