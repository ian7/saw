#require 'relation'
class Tagging < Relation
#  unloadable
  
  #TODO: putting initialize (constructor) there does blow up !
  def after_initialize
    type = "Tagging"
  end
  
  def taggable
    return Taggable.find( tip )
  end
  
  def tag
    return Tag.find( origin )
  end
  
end