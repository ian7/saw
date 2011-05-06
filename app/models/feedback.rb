class Feedback
  include Mongoid::Document
  field :comment, :type => String
  field :url, :type => String
  field :author, :type => String
end
