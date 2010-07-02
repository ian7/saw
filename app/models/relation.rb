#require 'taggable'

class Relation < Taggable
  
  # for some unknown reason this doesn't do the job.
  def relate( taggable1, taggable2 )
    origin = taggable1.id
    tip = taggable2.id
    #tip = 666
    #origin = 123
    save
    attributes["origin"] = taggable1.id
    attributes["tip"] = taggable2.id
    puts "relation: "+id.to_s+" origin: "+origin.to_s+ " tip: "+tip.to_s
    save
  end
  
  def tip_taggable
    Taggable.find tip
  end
  
  def origin_taggable
    Taggable.find origin
  end
  
  include  DynamicObject
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
  


end
