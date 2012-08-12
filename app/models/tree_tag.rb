class TreeTag < Tag
  def to_hash_recursive
    
    tree = to_hash
    tree["children"]=[];
    tree["data"]={}
    
    children.each do |childProject|
      tree["children"] << childProject.to_hash_recursive
    end
    
    return tree
  end
  
  def children
    allProjects = TreeTag.find :all, :conditions=>{:type=>type}
#    puts allProjects.count.to_s

    childrenProjects = []
    
    allProjects.each do |childProject|
      if childProject["parent"] != nil && childProject["parent"] == name
        childrenProjects << childProject
      end
    end

    return childrenProjects
  end

  def childrenRecursive
    childrenProjects =  children

    childrenProjects.each do |childProject|
      childrenProjects.concat childProject.children
    end 

    return childrenProjects
  end
  

  def parent
    return Taggable.find :first, :conditions=>{:type=> type, :name=>self["parent"]}
  end

  def parent= (new_parent)
    self["parent"] = new_parent
  end
    


  # def parent
  #   if ["parent"] != nil  
  #     retval = TreeTag.find :first, :conditions=>{:type=>type, :name=>["parent"] }
  #   else
  #     return nil
  #   end
  # end
  
  # def parent= ( t )
  #   if t.type == ["type"]
  #     parent = t.name
  #   end
  # end
end

