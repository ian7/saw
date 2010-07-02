class RelationController < ApplicationController
  def list
    @taggable_id = params[:id]    
    @taggable = 
    @relations_to = Taggable.find(@taggable_id).all_relations_to
    @relations_from = Taggable.find(@taggable_id).all_relations_to
  ## it doesn't make any sense to fetch relations for more than single taggable
  end

  ## principaly that should be called from some JavaScript
  
  def relate
    
  ## fetch params
    @from_taggable_id = params[:from_taggable_id]
    @to_taggable_id = params[:to_taggable_id]
    @reation_name = params[:relation_name]
  
  ## TODO: there should go some sanity check like checking if 
  ##   * taggables exist
  ##   * relation of the given name exists
  ##   * tip matches relation scope
  ##
  ##   but i just skip it for now ;)
  
  ## ugly ugly, but works
  @relation_instance = DynamicType.find_by_name(@relation_name).new_instance
  @relation_instance.origin = @from_taggable_id
  @relation_instance.tip = @to_taggable_id
  @relation_instance.save
  
  ## not quite sure on what to do after... some redirect probably
  end

  def unrelate

  ## fetch params
    @from_taggable_id = params[:from_taggable_id]
    @to_taggable_id = params[:to_taggable_id]
    @reation_name = params[:relation_name]
 
  ## find the taggable
   @relation_instance = Taggable.find :first, :conditions=>{:type=>@relation_name, :origin=>@from_taggable_id, :tip=>@to_taggable_id }
   
  ## kill it
   if @relation_instance != nil
     @relation_instance.destroy
   end
      
  end

end
