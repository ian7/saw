require 'json'

class ProjectsController < ApplicationController
  
  before_filter :authenticate_user!, :except => [:import,:export]
    
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

  def export
    p = Project.find params[:id]
    
    e=[]
    e.concat p.related_to
    #e.concat p.relations_to
    e.concat p.related_from
    #e.concat p.relations_from

    # dig through issues to alternatives
    p.related_from('Tagging','Issue').each do |issue|
      

      alternatives = issue.related_to 'SolvedBy','Alternative'

      e.concat alternatives
      e.concat issue.relations_to 'SolvedBy'

      # let's top it up with relations between alternatives. 
      # and hope that it was enough
      alternatives.each do |a|
        e.concat a.relations_to 
      end
    end


    j = e.to_json
    respond_to do |format|
 #     format.html # index.html.erb
      format.json  { render :json => j }
    end
  end

  def import
    p = Project.find params[:id]

    # this is fairly unbelievable, but this is the method to retrieve payload from the put call
    #value = params.first[0].to_s
    value = request.raw_post

    d = JSON.parse( value )

    i_count = 0
    d_count = 0

    d.each do |i|

    t = nil
    
    case i._type
      when 'Relation'
       t=Relation.new(i)
      when 'Tagging'
       t=Tagging.new(i)
      else
       t=Taggable.new( i )
    end

     t.save

      case t.type
       when 'Issue'
          t.do_tag_with( p )
          i_count = i_count + 1
        when 'Tagging'
          t.do_tag_with( p )
          d_count = d_count + 1
        else
          #do nothing
      end

    end

    respond_to do |format|
 #     format.html # index.html.erb
      format.any  { render :text => "it worked - "+i_count.to_s+" issues, and "+d_count.to_s+" decisions - total: "+d.length.to_s }
    end
  end
end
