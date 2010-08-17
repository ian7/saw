module MetricsHelper
end

module Metrics
  
  def Metrics.complexity( id )
    
    t = Taggable.find( id ) 
    
    # this just cuts all nodes other than issues
    if t.type != "Issue"
      return 0
    end
   
    #and now we count relations   
    #return t.relations_to("SolvedBy","Alternative").count 
    return t.relations_to("SolvedBy").size  
    
  end

  def Metrics.descriptiveness( id )
    
    t = Taggable.find( id ) 
    
    # this metrics accepts any type of knowledge items 
 
 
 
    #total number of attributes that it has
    
    empty_attributes_count = 0
    
    t.dynamic_type.dynamic_type_attributes.each do |a|
      if t[a.attribute_name]==nil
        empty_attributes_count = empty_attributes_count + 1
      end 
    end   
    
    return  empty_attributes_count
    
  end

  def Metrics.classification( id )
    
    t = Taggable.find( id ) 
    
    # this just cuts all nodes other than issues
    if  t.type != "Issue" && t.type != "Alternative"
      return 0
    end
   
    #and now we count relations   
    #return t.relations_to("SolvedBy","Alternative").count 
    return t.tags.size  
  end
  
  
  def Metrics.completeness( id )
    
    t = Taggable.find( id ) 
    
    # this just cuts all nodes other than issues
    if  t.type != "Issue"
      return 0
    end
   
    #and now we count relations   
    #return t.relations_to("SolvedBy","Alternative").count 
    
    missing_decisions_count = 0
    
    t.relations_to("SolvedBy").each do |r|
      if r.related("Tagging","Decision").size  == 0 
        missing_decisions_count = missing_decisions_count + 1
      end
    end
    
    return missing_decisions_count
  end
  
  
  
  # return values follow....
  # 0 - no alternatives
  # 1 - no decisions at all
  # 2 - some decisions missing
  # 3 - inconsistent (multiple decisions on single alternative)
  # 4 - multiple positive
  # 5 - single postive, neutrals exist
  # 6 - single positive decisions - all other negative
  
  def Metrics.definiteness( id )
    
    t = Taggable.find( id ) 
    
    # this just cuts all nodes other than issues
    if  t.type != "Issue"
      return 0
    end
   
    #and now we count relations   
    
    positive_decisions_count = 0;
    neutral_decisions_count = 0;
    total_decisions_count = 0;
    
    relations_to_alternatives = t.relations_to("SolvedBy") 
    
    
    # if there are no alternatives at all...
    if relations_to_alternatives.size == 0 
      return 0
    end
        
    relations_to_alternatives.each do |r|
      decisions = r.related("Tagging","Decision") 

      total_decisions_count += decisions.size  
           
      # if there is more than one decision over single alternative then issue is in inconsistent state
      if decisions.size  > 1
        return 3 
      end
     
     # if there are some decisions at all 
      if decisions.size  > 0 
     
        # if positive decision was found then add it up
        if decisions.first.name == "Positive"
          positive_decisions_count = positive_decisions_count + 1
        end
        if decisions.first.name == "Neutral"
          neutral_decisions_count = neutral_decisions_count + 1
        end
     end 
     
    end

     # if there is decision missing for particular alternative, then issue is in undefined state.
    if total_decisions_count == 0
        return 1 
    end
    if total_decisions_count < relations_to_alternatives.size  
        return 2
    end
    
    # at this point we're soure that all alternative has single decision on it
    
    if positive_decisions_count == 1    
      if neutral_decisions_count == 0
        # That's perfect case - single positive decision, no neutral
        return 6
     else   
        # single positive, neutral decisions available 
        return 5
      end
    end 
    
 
    
    # multiple positive decisions 
    return 4
  end
  
  
end
