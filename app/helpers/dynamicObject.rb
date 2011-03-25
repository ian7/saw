require 'attribute'
require 'dynamic_type'

module DynamicObject
#mongo  def [](attribute_name)
#mongo    #puts id
#mongo    selected_attribute = Attribute.find :first, :conditions=>{:taggable_id=>id, :name=>attribute_name}
#mongo    return selected_attribute
#mongo end

#mongo  def []=(attribute_name, attribute_value)
#    puts id
#    puts attribute_name
#    puts attribute_value
#mongo    if  attribute_value == nil || attribute_value == ""
#mongo      return ""
#mongo    end
#mongo    
#mongo    selected_attribute = Attribute.find :first, :conditions=>{:taggable_id=>id, :name=>attribute_name}
#mongo    if selected_attribute == nil
#mongo       new_attribute = Attribute.new
#mongo       new_attribute.taggable_id = id
#mongo       new_attribute.name = attribute_name
#mongo       new_attribute.value = attribute_value
#mongo       new_attribute.save
#mongo    else
#mongo      selected_attribute.value = attribute_value
#mongo      selected_attribute.save
#mongo    end
#mongo   return selected_attribute
#mongo  end
  
  def dynamic_type
    if attributes["type"] == nil
      return nil
    else
      selected_type = DynamicType.find :first, :conditions=>{:name=>attributes["type"]}
    end
  end
  

end
