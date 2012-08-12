
class Project < TreeTag
  has_and_belongs_to_many :managers, :class_name=>'User'
  has_and_belongs_to_many :users, :class_name=>'User'
  has_and_belongs_to_many :observers, :class_name=>'User'


  # what it odes is that it creates new project and re-tags all issues belonging to the particular one. 
  public
  def fork( new_name )
  	subProject = Project.new
  	subProject.type = "Project"
  	subProject.name = new_name
    subProject["parent"] = name
  	subProject.save
    issues.each { |i| subProject.make_tagging( i ) }
    return subProject
  end

  def issues
  	return taggables.find_all{|item| item.type=="Issue" }
  end


  def initialize(params={})
  	super( params )
#  	@name = new_name
  	@type = "Project"
  	#["type"] = "Project"
  	save
  end

  def self.find_by_name n
  	return Project.find :first, :conditions=>{:name=>n}
  end

  def to_hash_recursive
    tree = to_hash
    tree["children"]=[];
    tree["data"]={}
    tree["data"]["issueCount"] = issues.count
    
    children.each do |childProject|
      tree["children"] << childProject.to_hash_recursive
    end
    
    return tree
  end
end