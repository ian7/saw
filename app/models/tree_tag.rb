class TreeTag < Tag
  def to_hash_recursive
    
    tree = to_hash
    tree["children"]=[]
    
    
    children.each do |childProject|
      tree["children"] << childProject.to_hash_recursive
    end
    
    return tree
  end
  
  def children
    allProjects = TreeTag.find :all, :conditions=>{:type=>"Project"}
    
    childrenProjects = []
    
    allProjects.each do |childrenProject|
      if childrenProject["parent"] != nil && childrenProject["parent"].value == name
        childrenProjects << childrenProject
      end
    end
    return childrenProjects
  end
  
end