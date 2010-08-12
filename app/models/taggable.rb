require 'dynamicObject'

class Taggable < ActiveRecord::Base
 # this is still to come after type is going to be renamed to dynamic_type

 # has_many :taggings_from, :class_name=>"Taggable", :conditions=>"type = \"Tagging\"", :foreign_key=>"origin", :primary_key=>"id"
 # has_many :taggings_to, :class_name=>"Taggable", :conditions=>"type = \"Tagging\"", :foreign_key=>"tip", :primary_key=>"id"
 # has_many :all_relations_to, :class_name=>"Taggable", :foreign_key=>"tip", :primary_key=>"id"
 # has_many :all_relations_from, :class_name=>"Taggable", :foreign_key=>"origin", :primary_key=>"id"
 
  include DynamicObject
  include TaggablesHelper
  
  self.inheritance_column ='ruby_type'
  
  def taggings_from
    retval = Tagging.find :all, :conditions=>{:type=>"Tagging", :origin=>id}
  end

  def taggings_to
    retval = Tagging.find :all, :conditions=>{:type=>"Tagging", :tip=>id}
  end
  
  def all_relations_from
    retval = Relation.find :all, :conditions=>{:origin=>id}
  end

  def all_relations_to
    retval = Relation.find :all, :conditions=>{:tip=>id}
  end

  
  def self.make_new( type )
    t = Taggable.new
    t.type = type
    return t
  end
  
  def tag
    return Tag.find_by_id(origin)  
  end
  
  
#  def taggings
#    Tagging.find :all, :conditions=>{:type=>"Tagging", :tip=>id}
#  end
  
  def tags( desired_tag_type="" )
    retval = []
    taggings_to.each do |tagging|
      tag = Taggable.find_by_id tagging.origin
      
      #if there was some particular type fo the tag requested, then verify if that matches
      if desired_tag_type != "" && tag.type !=desired_tag_type
        # in case it doesn't, then just skip it.
        next
      end
      
      if tag != nil
        retval << tag
      end
    end
    return retval
  end
  
## lists relations origining from (with) this taggable
def relations_from( relation_type = "" )
    if relation_type == ""
      relations = Relation.find :all, :conditions=>{:origin=>id }
    else
      relations = Relation.find :all, :conditions=>{:type=>relation_type, :origin=>id }
    end
    return relations
  end
  
## returns taggables related to this taggable
def related_from( relation_type = "", taggable_type = "" )
  
  related_taggables = []
  
  relations_from( relation_type ).each do |relation|
    related_taggable = Taggable.find relation.tip
    
    ## check if desired taggable_type was specified and if it matches one that was found. 
    if taggable_type == "" || (taggable_type != "" && related_taggable.attributes["type"] == taggable_type) 
      related_taggables << related_taggable
    end
  end
  
  return related_taggables
end
 
# lists relations pointing to this taggable 
def relations_to( relation_type = "" )
    
    if relation_type == ""
      relations = Relation.find :all, :conditions=>{:tip=>id }
    else
      relations = Relation.find :all, :conditions=>{:type=>relation_type, :tip=>id }
    end 
    return relations
  end

## returns taggables related to this taggable
def related_to( relation_type = "", taggable_type = "" )
  
  related_taggables = []
  
  relations_to( relation_type ).each do |relation|
    
    if( Taggable.exists? relation.origin )
      related_taggable = Taggable.find relation.origin
    else
      next
    end
    
    ## check if desired taggable_type was specified and if it matches one that was found. 
    if taggable_type == "" || (taggable_type != "" && related_taggable.attributes["type"] == taggable_type) 
      related_taggables << related_taggable
    end
  end
  
  return related_taggables
end

### returns taggables to which this one is both related to and related from
def related( relation_type = "", taggable_type = "" )
  related_taggables = [];
  related_taggables.concat related_from( relation_type, taggable_type );
  related_taggables.concat related_to( relation_type, taggable_type );
  return related_taggables;
end

def to_hash
  h={}
  h["name"]=name
  h["id"]=id
  h["type"]=type
  return h
end

def to_graph

  h={}
  h["adjacencies"]=[];
  h["adjacencies"] << id.to_s();
  
  had={};
  had["$color"]="#83548B";
  had["$type"]="circle";
  had["$dim"]=10;
  had["type"]=type;
  
  h["data"] = had;
  
  h["id"]=id.to_s();
  h["name"]=name;
  
  all_relations_from.each do |relation|
    rh = {};
    rh["nodeTo"] = relation.tip.to_s();
    rh["nodeFrom"] = relation.origin.to_s();

    rhd={};
    rhd["$color"]="#557EAA";
    rh["data"] = rhd;

    h["adjacencies"] << rh 
  end

 all_relations_to.each do |relation|
    rh = {};
    rh["nodeTo"] = relation.tip.to_s();
    rh["nodeFrom"] = relation.origin.to_s();

    rhd={};
    rhd["$color"]="#557EAA";
    rh["data"] = rhd;

    h["adjacencies"] << rh 
  end

  return h
end

def type
  return attributes["type"]
end

def controller
 if type == "Issue"
     return "issues"
 end
 if type == "Alternative"
   return "alternatives"
 end
 
 #all the rest 
  if dynamic_type.surrogate_class != nil
    return dynamic_type.surrogate_class.downcase.pluralize
  else
    # that principally shouldn't happen..... 
    # happens though ;)
    return "taggables"
  end
end
  
end
