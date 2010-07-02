class TaggablesController < ApplicationController
      layout nil;

  include TaggablesHelper

  def show
    @taggable_instance = Taggable.find(params[:id])
    
    #@taggable_id = params[:id]

    h={}
    h["Id"]=@taggable_instance.id
    h["Name"]=@taggable_instance.name
    h["Type"]=@taggable_instance.type
    h["tip"]=@taggable_instance.tip
    h["origin"]=@taggable_instance.origin
    
    if @taggable_instance["Description"]!= nil
     h["Description"]=@taggable_instance["Description"].value
    end

    @taggable_instance.dynamic_type.dynamic_type_attributes.each do |attribute_instance|
      
      if @taggable_instance[attribute_instance.attribute_name] != nil 
        h[attribute_instance.attribute_name]=(@taggable_instance[attribute_instance.attribute_name]).value        
      else
        h[attribute_instance.attribute_name]=""
      end
      #      
    end
    
    respond_to do |format|
      format.html
      format.json { render :json => h }
#      format.xml  { render :xml => taggable_instance.relations_from }
      end
  end
  
  def index
    
  end
  
  def search
    if 0 == params['criteria'].length
      @items = nil
    else
      @items = Taggable.find(:all, :conditions => [ 'LOWER(name) LIKE ?','%' + params['criteria'].downcase + '%' ])
      @mark_term = params['criteria']
    end
    #render_without_layout
  end
end
