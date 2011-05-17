class RationalesController < ApplicationController
  def new    
  end
  def create
    r = DynamicType.find_by_name("Rationale").new_instance
    r.name = params[:name]
    r.save
    if params[:decision_id]
      
      @relation_instance = DynamicType.find_by_name("Tagging").new_instance(nil, current_user)
      @relation_instance.save
      @relation_instance.origin = r.id
      @relation_instance.tip = Taggable.find(params[:decision_id]).id
      #@relation_instance.save_with_dirty!
      @relation_instance.save
    end
      
    respond_to do |format|
       format.html { }
       format.json { render :json => @relation_instance.id }
     end
      
      
      
  end
end
