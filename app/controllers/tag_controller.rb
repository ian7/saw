#require 'ApplicationHelper'
require 'application_helper'

class TagController < ApplicationController
#unloadable
  #helper :taggables
  include TaggablesHelper
  
  def index
    # load infovis tag visualisation
    @onload = 'init("Tag");'
    
    @issues = Taggable.find :all, :conditions=>{:type=>"Issue"}

    respond_to do |format|
      format.html # index.html.erb
      format.xml  #index.xml.builder #{ render :xml => @issues }
    end
  end
  
  def list
    
    if params[:taggable_id] != nil
      @taggable_id = params[:taggable_id]
    end
    
    if params[:issue_id] != nil
      @taggable_id = params[:issue_id]
    end
    
    if params[:item_id] != nil
      @taggable_id = params[:item_id]
    end
    
    @taggable = Taggable.find :first, :conditions=>{ :id => @taggable_id }
    
    @scope_name = @taggable.attributes["type"]
    @scopes = DynamicTypeScope.find :all, :conditions=>{:type_scope=>@scope_name}
    @return_taggable_id = params[:return_taggable_id] 
    
    @tags=[]
    
    @scopes.each do |scope|
      Taggable.find(:all, :conditions=>{:type=>scope.type_name}).each do |t|
       @tags << t 
     end
   end
   
    respond_to do |format|
      format.html {
           if params[:overlay]!=nil
              render :partial => 'list_min', :locals => { :return_taggable_id => @return_taggable_id }
            end } # index.html.erb
      format.xml 
      format.json { render :json => @tags }
    end
   
  end
   
  def dotag   
  ## fetch params
  
  
  
    @from_taggable_id = params[:from_taggable_id]
    @to_taggable_id = params[:to_taggable_id]
    
    if params[:item_id] 
    	@to_taggable_id = params[:item_id]
    end
 
    @relation_name = "Tagging"
  
  ## TODO: there should go some sanity check like checking if 
  ##   * taggables exist
  ##   * relation of the given name exists
  ##   * tip matches relation scope
  ##
  ##   but i just skip it for now ;)
  
  ## ugly ugly, but works
  @relation_instance = DynamicType.find_by_name(@relation_name).new_instance
  @relation_instance.save
  @relation_instance.origin = Taggable.find(@from_taggable_id).id
  @relation_instance.tip = Taggable.find(@to_taggable_id).id
  #@relation_instance.save_with_dirty!
  @relation_instance.save
  
  ## not quite sure on what to do after... some redirect probably
  @to_taggable=Taggable.find @to_taggable_id
  
  Juggernaut.publish("/chats", @to_taggable_id)
  
   respond_to do |format|
      format.html {      
      	if params[:return_taggable_id]== nil || params[:return_taggable_id]==""
		    #redirect_to("/"+@to_taggable.attributes["type"].downcase.pluralize+"/"+@to_taggable.id.to_s )
		    redirect_to( taggable_path( @to_taggable )) 
		  else
		    @return_taggable = Taggable.find params[:return_taggable_id]
		    #redirect_to("/"+@return_taggable.attributes["type"].downcase.pluralize+"/"+@return_taggable.id.to_s )
		    redirect_to( taggable_path( @return_taggable )) 
		  end
		 }
      format.xml  { render :xml => @taggings }
      format.json { render :json => @to_taggable }
      format.js {head :ok}
    end
    
  
  
  end

  def untag

  ## fetch params
    @from_taggable_id = params[:from_taggable_id]
    @to_taggable_id = params[:to_taggable_id]
    @relation_name = "Tagging"
 
  ## find the taggable
   @relation_instance = Taggable.find(:first, :conditions=>{:type=>@relation_name, :origin=>@from_taggable_id, :tip=>@to_taggable_id })
   
  ## kill it
   if @relation_instance != nil
     @relation_instance.destroy
   end
   
  ## not quite sure on what to do after... some redirect probably
  @to_taggable=Taggable.find @to_taggable_id


  #redirect_to("/"+@to_taggable.attributes["type"].downcase.pluralize+"/"+@to_taggable.id.to_s )
     
  if params[:return_taggable_id]== nil || params[:return_taggable_id]==""
    redirect_to(  taggable_path(@to_taggable) )
    #redirect_to("/"+@to_taggable.attributes["type"].downcase.pluralize+"/"+@to_taggable.id.to_s ) 
  else
    @return_taggable = Taggable.find params[:return_taggable_id]
    redirect_to( taggable_path( @return_taggable ) )
    #redirect_to("/"+@return_taggable.attributes["type"].downcase.pluralize+"/"+@return_taggable.id.to_s ) 
  end
  
      
  end
  
  def tree
    if params[:id]!=nil
      dt = DynamicType.find params[:id]
    end
    
    if params[:tag_name]!=nil
      dt = DynamicType.find_by_name params[:tag_name]
    end
    
    if dt != nil
      respond_to do |format|      
       format.json { render :json => dt.to_hash_recursive }
      end
   end
  end
  
  def cloud

    if params[:type_name] != nil
      @dt = DynamicType.find_by_name params[:type_name]
    end
    if params[:type_id] != nil
      @dt = DynamicType.find params[:type_id]      
    end
  
    @cloud = []
    highest_count = 0
    
    @dt.instances.each do |t|
      tag={}
      tag["name"]=t.name
      tag["id"]=t.id
      tag["count"]=t.taggings_from.size

      if tag["count"] > highest_count 
        highest_count = tag["count"]
      end
      
      if tag["count"] > 0
        @cloud << tag
      end
    end     
 
    @cloud.each do |tag|
      tag["rank"]=tag["count"]*5/(highest_count)+1  
    end    
    
  end
  
  def type_cloud
    
    @cloud=[]
    
    DynamicType.find_by_name("Tag").children_types_recursive.each do |dt|
      tag={}
      tag["name"]=dt.name
      
      tag_instances = Tag.find(:all, :conditions=>{:type=>dt.name}) 
      
      taggings_count = 0 
      
      tag_instances.each do |t|
        taggings_count = taggings_count + t.taggings_from.size
      end
      
      tag["count"]= tag_instances.size
      tag["taggings_count"] = taggings_count
      
      if tag["count"] > 0
        @cloud << tag
      end
    end
    
    instance_count = 0
    highest_count = 0
    
    @cloud.each do |tag|
      instance_count = instance_count + tag["count"]
      if tag["count"] > highest_count 
        highest_count = tag["count"]
      end
    end

    @cloud.each do |tag|
      tag["rank"]=tag["count"]*5/(highest_count)+1  
    end    
  end
  

  def taggings_list
    @tag = Tag.find params[:tag_id]
    @taggings = @tag.taggings_from  
  end

  def tags_list
  	if params[:taggable_id]
    	@taggable = Taggable.find params[:taggable_id]
   end
   if params[:issue_id]
   		@taggable = Taggable.find params[:issue_id]
   end
   
   if params[:item_id]
   		@taggable = Taggable.find params[:item_id]
   end

   		
    @taggable_id = @taggable.id
    @taggings = @taggable.taggings_to
    
    @return_taggable_id = params[:return_taggable_id]

    respond_to do |format|
      format.html {    render :partial=>"layouts/taggings" }
      format.xml  { render :xml => @taggings }
      format.json {
      	# we're not really interested in all taggings bullshit. 
      	# for the view it would be more interesting to see information 
      	
      	taggings_json = [];
      	@taggings.each do |t|
      			h = {};
      			h["type"] = t.tag.type;
      			h["name"] = t.tag.name
      			h["tag_id"] = t.tag.id;
      			h["tagging_id"] = t.id;
      			taggings_json << h
      	end
      	
      	render :json => taggings_json 
      	}      
    end
    
  end
  
  def tag_instances 
    
    if params[:type_name] == nil
      @dt = DynamicType.find_by_name("Tag")
    else
      @dt = DynamicType.find_by_name(params[:type_name])
    end

    @tags = @dt.children_instances_recursive
    @tags = @tags | @dt.instances
    
    render :partial=>"tags/list"
  end
  
end
