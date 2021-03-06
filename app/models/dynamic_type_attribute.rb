#require 'dynamic_type'

class DynamicTypeAttribute # < ActiveRecord::Base
	include Mongoid::Document	
    field :type_name, :type => String
    field :attribute_name, :type => String

	
#  belongs_to :dynamic_type, :primary_key=>"name",  :foreign_key=>"type_name"
  #has_one :dynamic_type, :primary_key=>"name",  :foreign_key=>"type_name"
  def dynamic_type
    return DynamicType.find( :first, :conditions=>{:name=>type_name} )
  end
end
