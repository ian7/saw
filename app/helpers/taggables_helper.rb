module TaggablesHelper
  def taggable_path( taggable )
    return  url_for( :controller=>taggable.controller, :action=>"show", :id=>taggable.id )
    # return "/"+taggable.attributes["type"].downcase.pluralize+"/"+taggable.id.to_s
  end
  
  def taggable_url( taggable )
    return taggable_path( taggable )
  end
end
