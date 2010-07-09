require 'taggables_helper'

class RelationsController < ApplicationController
  layout nil;
  
  def from
    taggable_instance = Taggable.find(params[:id])
    respond_to do |format|
      format.json { render :json => taggable_instance.relations_from }
#      format.xml  { render :xml => taggable_instance.relations_from }
      format.html { @taggings =  taggable_instance.relations_from; }
    end
  end

  def to
    taggable_instance = Taggable.find(params[:id])
    respond_to do |format|
      format.json { render :json => taggable_instance.relations_to }
#      format.xml  { render :xml => taggable_instance.relations_from }
      format.html { @taggings =  taggable_instance.relations_to; }
    end
  end
  
 def tree_to
    taggable_instance = Taggable.find(params[:id])
 
    h=taggable_instance.to_hash
    
    children=[];
    
    if params[:type] == nil
      children_taggables = taggable_instance.related_to
    else
      children_taggables = taggable_instance.related_to(params[:type])
    end

   children_taggables.each do |child|
      c = child.to_hash
      c["data"] = {}
      c["data"]["relation"] = Relation.find(:first, :conditions=>{:tip=>taggable_instance.id, :origin=>child.id}).type

      c["children"] = []
      #children << child.to_hash
      children << c.to_hash
      
    end
    
    h["children"] = children
    h["data"] = []
    
    respond_to do |format|      
     format.json { render :json => h }
    end
  end

def tree_from
    taggable_instance = Taggable.find(params[:id])
 
    h=taggable_instance.to_hash
    
    children=[];
    
    if params[:type] == nil
      children_taggables = taggable_instance.related_from
    else
      children_taggables = taggable_instance.related_from(params[:type])
    end

   children_taggables.each do |child|
      c = child.to_hash
      c["data"] = {}
    
      #c["data"]["type"] = child.type
      c["data"]["relation"] = Relation.find(:first, :conditions=>{:origin=>taggable_instance.id, :tip=>child.id}).type
    
      c["children"] = []
      #children << child.to_hash
      children << c.to_hash
    end
    
    h["children"] = children
    h["data"] = []
    
    respond_to do |format|      
     format.json { render :json => h }
    end
  end

def tree
    taggable_instance = Taggable.find(params[:id])
 
    h=taggable_instance.to_hash
    
    children=[];
    
    if params[:type] == nil
      children_taggables_from = taggable_instance.related_from
      children_taggables_to = taggable_instance.related_to
    else
      children_taggables_from = taggable_instance.related_from(params[:type])
      children_taggables_to = taggable_instance.related_to(params[:type])
    end

   children_taggables_from.each do |child|
      c = child.to_hash
      c["data"] = {}    
      relation_instance = Relation.find(:first, :conditions=>{:origin=>taggable_instance.id, :tip=>child.id})
   
      c["data"]["relation"] = relation_instance.type
      
      if relation_instance.type == 'Influences'
        c["data"]["relationColor"] = "#0000ff"
      end
      
      if relation_instance.type == 'SolvedBy'
        c["data"]["relationColor"] = "#ff0000"
      end

      if relation_instance.type == 'Tagging'
        c["data"]["relationColor"] = "#ffff00"
      end
      
      
      relation_instance.tags.each do |tag_instance|
        c["data"][tag_instance.type]=tag_instance.name
      end
       
          
      c["data"]["direction"]="from"
      c["children"] = []
      children << c.to_hash
    end

   children_taggables_to.each do |child|
      c = child.to_hash
      c["data"] = {}    
      relation_instance = Relation.find(:first, :conditions=>{:tip=>taggable_instance.id, :origin=>child.id})
      c["data"]["relation"] = relation_instance.type
      c["data"]["direction"]="to"
      
      if relation_instance.type == 'Influences'
        c["data"]["relationColor"] = "#0000ff"
      end
      
      if relation_instance.type == 'SolvedBy'
        c["data"]["relationColor"] = "#ff0000"
      end

      if relation_instance.type == 'Tagging'
        c["data"]["relationColor"] = "#ffff00"
      end
      

      relation_instance.tags.each do |tag_instance|
        c["data"][tag_instance.type]=tag_instance.name
      end

      c["children"] = []
      children << c.to_hash
    end

    
    h["children"] = children
    h["data"] = []
    
    respond_to do |format|      
     format.json { render :json => h }
    end
  end


def relate
    origin_taggable = Taggable.find params[:origin]
    tip_taggable = Taggable.find params[:tip]
    
    
    ## TODO: this is not completly safe in case that find_by_name fails
    relation_instnace = DynamicType.find_by_name("SolvedBy").new_instance
    
    #relation_instance 
    
    if origin_taggable != nil && tip_taggable != nil && relation_instnace != nil 
      relation_instnace.tip = tip_taggable.id
      relation_instnace.origin = origin_taggable.id
      relation_instnace.save
  end
  
  redirect_to ( issue_url(tip_taggable.id) )
end

def view
end

end
