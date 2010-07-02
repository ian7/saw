require 'attribute'
require 'dynamic_type'

module DynamicObject
  def [](attribute_name)
    #puts id
    selected_attribute = Attribute.find :first, :conditions=>{:taggable_id=>id, :name=>attribute_name}
    return selected_attribute
  end

  def []=(attribute_name, attribute_value)
#    puts id
#    puts attribute_name
#    puts attribute_value
    if  attribute_value == nil || attribute_value == ""
      return ""
    end
    
    selected_attribute = Attribute.find :first, :conditions=>{:taggable_id=>id, :name=>attribute_name}
    if selected_attribute == nil
       new_attribute = Attribute.new
       new_attribute.taggable_id = id
       new_attribute.name = attribute_name
       new_attribute.value = attribute_value
       new_attribute.save
    else
      selected_attribute.value = attribute_value
      selected_attribute.save
    end
   return selected_attribute
  end
  
  def dynamic_type
    if attributes["type"] == nil
      return nil
    else
      selected_type = DynamicType.find :first, :conditions=>{:name=>attributes["type"]}
    end
  end
  

end
