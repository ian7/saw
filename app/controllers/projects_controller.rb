require 'cgi'
require 'json'
require 'nokogiri'

class ProjectsController < ApplicationController
  
#  before_filter  :authenticate_user! , :except => [:import,:export,:report]

  def show
    @project = Project.find params[:id]
    respond_to do |format|
      format.html
      format.json {render :json=> @project.to_json}
      format.tex {render :project => @project }
    end
  end

  def report
    @project = Project.find params[:id]
    respond_to do |format|
      format.tex {render :project => @project }
      format.html { render :project => @project, :layout=>false }
    end
  end

  def report2
    @project = Project.find params[:id]
    respond_to do |format|
      format.html { render :project => @project, :layout=>false }
    end
  end

  def index
     # this is specific for tag-tree visualization
     # @onload = 'init("Project");'
     
     # i'm making use of that other way. 
     #@onload = 'getJSON("'+ "projects" + '.json", callback);'
     
     @allProjects = TreeTag.find( :all, :conditions=>{:type=>"Project"}).asc("name")
     
    # @allProjects.sort! { |a,b| a.name <=> b.name }
     
     tree = {};
     tree["name"]="Projects"
     #tree["id"]=0
     tree["data"]={}
     tree["type"]="RootNodeWithoutType"
     tree["children"]=[]
     

     #t = []
     # first i want to find all root projects (those without parents)
     
     @allProjects.each do |someProject|
       if someProject["parent"] == nil || someProject["parent"] == "(empty)"
         
         # and then I hash-dump them recursively
         p = someProject.to_hash_recursive
         tree["children"] << p
         #t << someProject.to_hash_recursive
       end
     end
     
     @projects = tree
     
     respond_to do |format|
      format.html { render :layout=>false } # index.html.erb
      format.json  { render :json => tree }
      format.tex { }
    end
  end

  def edit
  end

  def new
  end

  def create
    puts params
    p=Project.new
    p.type="Project"
    p.name=params[:name]
    p.save

    respond_to do |format|
      format.json  { render :json => p.to_json }
    end

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


      # here we add issue taggings
      e.concat issue.related_to 'Tagging'
      e.concat issue.relations_to 'Tagging'

      alternatives = issue.related_to 'SolvedBy','Alternative'

      e.concat alternatives

      # solved by relations
      sbs = issue.relations_to 'SolvedBy'
      e.concat sbs

      # decisions on sb relations
      sbs.each do |sb|
        e.concat sb.related_to
        e.concat sb.relations_to
      end


      # let's top it up with relations between alternatives. 
      alternatives.each do |a|
        e.concat a.relations_to 
        # catch solvedBy
        #arvs = a.relations_from
        #arvs.each do |arv|

        #end
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
    rt_count = 0


    # hash map between old and new ids
    reuse_hash={}

    d.each do |i|

      t = nil

      #debugger
      if i["type"] == "SolvedBy"
        #debugger
      end

      t = DynamicType.find_by_name(i["type"]).new_instance
      
      #copy all attributes
      i.each do |a,v|
        case a
          when 'tip'
            t[a] = BSON::ObjectId.from_string v
          when 'origin'
            t[a] = BSON::ObjectId.from_string v
          else
            t[a] = v
          end
      end


      case t._type
        # we should try to reuse tags - create only those which don't already exist
        when 'Tag'
          # in case tag with the same name and type already exists, then reuse
          #debugger
          if Taggable.exists?(:conditions=>{:_type=>"Tag",:name=>t.name,:type=>t.type})
            new_t=Taggable.find :first, :conditions=>{:_type=>"Tag",:name=>t.name,:type=>t.type}
            # keep reused ids in hash

            reuse_hash[t.id]=new_t.id

            rt_count = rt_count + 1

          else
            # othrerwise just create it
            t.save
          end
        else
          t.save
        end

      case t.type
        when 'Issue'
          t.do_tag_with( p )
          i_count = i_count + 1
        when 'Tagging'

          #in case origin was reused
          if reuse_hash[t.origin]
            t.origin = reuse_hash[t.origin]
            t.save
          end

          t.do_tag_with( p )
          d_count = d_count + 1
        else
          # do nothing
        end
    end

    respond_to do |format|
 #     format.html # index.html.erb
      format.any  { render :text => "it worked - "+i_count.to_s+
          " issues, and " + d_count.to_s+" taggings - total: "+d.length.to_s +
          " reused tags: " + rt_count.to_s}
    end
  end
  
end
