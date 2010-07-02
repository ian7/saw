class DynamicTypeScope < ActiveRecord::Base
#  belongs_to :dynamic_type, :primary_key=>"name",  :foreign_key=>"type_name"
# has_one :dynamic_type, :primary_key=>"name",  :foreign_key=>"type_name"
  def dynamic_type
    return DynamicType.find( :first, :conditions=>{:name=>type_name} )
  end
end
