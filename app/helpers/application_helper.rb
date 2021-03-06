#require 'Taggable'

# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
#  def taggable_url( t )
#    return "/"+t.type.downcase+"/"+t.id.to_s
#  end
  def taggable_path( taggable )
    return url_for( :controller=>taggable.attributes["type"].downcase.pluralize, :action=>"show", :id=>taggable.id )
    # return "/"+taggable.attributes["type"].downcase.pluralize+"/"+taggable.id.to_s
  end
  
  def taggable_url( taggable )
    return taggable_path( taggable )
  end
  
  def image_dir() 
    retval = image_path("abc.png").to_s()[0..image_path("abc.png").rindex("abc.png")-1]
  end 
end
  
#  def taggable_path( taggable )
#    return url_for( :controller=>taggable.attributes["type"].downcase.pluralize, :action=>"show", :id=>taggable.id )
#    # return "/"+taggable.attributes["type"].downcase.pluralize+"/"+taggable.id.to_s
#  end
#  
#  def taggable_url( taggable )
#    return taggable_path( taggable )
#  end