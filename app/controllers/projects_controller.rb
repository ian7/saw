class ProjectsController < ApplicationController
  
  before_filter :authenticate_user!
    
  def show
    @project = Project.find params[:id]
  end

  def index
     # this is specific for tag-tree visualization
     # @onload = 'init("Project");'
     
     # i'm making use of that other way. 
     #@onload = 'getJSON("'+ "projects" + '.json", callback);'
     
     @allProjects = Tag.find( :all, :conditions=>{:type=>"Project"}).asc("name")
     
#     @allProjects.sort! { |a,b| a.name <=> b.name }
     
     tree = {};
     tree["name"]="Projects"
     #tree["id"]=0
     tree["data"]=[];
     tree["type"]="RootNodeWithoutType"
     tree["children"]=[];
     
     # first i want to find all root projects (those without parents)
     
     TreeTag.find(:all,:conditions=>{:type=>"Project"}).each do |someProject|
       if someProject["parent"] == nil
         
         # and then I hash-dump them recursively
         tree["children"] << someProject.to_hash_recursive
       end
     end
     
     @projects = tree
     
     respond_to do |format|
      format.html # index.html.erb
      format.json  { render :json => tree }
    end
  end

  def edit
  end

  def new
  end

  def create
  end

  def update
  end

  def destroy
  end

end
