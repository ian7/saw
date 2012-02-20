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
  field :image
	 
	ROLES = %w[admin user]
	
	def apply_omniauth(omniauth)  

  case omniauth['provider']
    when 'facebook'
#      if (extra = omniauth['extra']['user_hash'] rescue false)
#         self.email = (extra['email'] rescue '')
          self.email = omniauth['user_info']['email']
          self.password = Devise.friendly_token[0,20]
          self.image = omniauth['user_info']['image']
#      end
    when 'twitter'
#        debugger 
        self.email = omniauth['user_info']['nickname']+"@twitter"
        self.password = Devise.friendly_token[0,20]
        self.image = omniauth['user_info']['image']
    when 'open_id'
      # there is nothing else but an url there... a pitty. but that's what we get
        self.email = omniauth['uid']
      # just a generic one...
        self.image = "/images/open_id_32.png"
    when 'google_apps'
        self.email = omniauth['user_info']['email'] 
        self.image = "/images/google_apps_32.png"      
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

  def password_required?  
    return false
    (authentications.empty? || !password.blank?) && super  
  end
    
end