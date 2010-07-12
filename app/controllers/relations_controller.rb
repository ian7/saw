require 'taggables_helper'

class RelationsController < ApplicationController
  layout nil;
  
  @@max_degree = 2;
  @@degree = 0;
  
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
    
    @@max_degree = params[:degree]
 
    if @@max_degree == nil
      @@max_degree = 0
    end

    # just to hack default parameter for related_from and _to
    if params[:type] == nil
      params[:type] = "";
    end
    
 
     
    children_taggables = taggable_instance.related(params[:type])
     
    h = related_to_hash( taggable_instance, children_taggables, 0, (params[:degree]).to_i());


    
    respond_to do |format|      
     format.json { render :json => h }
    end

  end




def related_to_hash( taggable_instance, children_taggables, degree=0, max_degree=0 )
  
   h=taggable_instance.to_hash

     
    children=[];

    children_taggables.each do |child|
       c = child.to_hash
       #c={}
       
       # serving from relations
       Relation.find(:all, :conditions=>{:origin=>taggable_instance.id, :tip=>child.id}).each do |r|
         c["data"] = r.to_hash;    
         c["data"]["direction"]="from";      
         c["children"] = [];     
       end
    
       # serving to relations
       Relation.find(:all, :conditions=>{:tip=>taggable_instance.id, :origin=>child.id}).each do |r|
         c["data"] = r.to_hash;    
         c["data"]["direction"]="to";      
         c["children"] = [];
       end
    
       children << c;
     end
   # 
    
     
    h["children"] = children
    h["data"] = []

    degree = degree + 1    
    
    puts degree.to_s + "/" + max_degree.to_s()
    
    if degree.to_i < max_degree.to_i
      
      h["children"].each do |child|
         child_instance = Taggable.find child["id"]
         if child_instance != nil
           child["children"] << related_to_hash( child_instance, child_instance.related, degree, max_degree )
         end
      end 
    end
    
    return h
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

def list
  
end


end
