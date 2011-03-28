class TagsController < ApplicationController
  include TaggablesHelper
   
 def list
    
    @taggable_id = params[:taggable_id]
    @scope_name = Taggable.find( @taggable_id ).attributes["type"]
    @scopes = DynamicTypeScope.find :all, :conditions=>{:type_scope=>@scope_name}
    @return_taggable_id = params[:return_taggable_id] 
    
    @tags=[]
    
    @scopes.each do |scope|
      Taggable.find(:all, :conditions=>{:type=>scope.type_name}).each do |t|
       @tags << t 
     end
   end
   
   if params[:overlay]!=nil
      render :partial => 'list_min'
    end
  end


  def create
    
      @dynamic_type = DynamicType.find_by_name params[:tag_type]
      
      @tag_instance = @dynamic_type.new_instance params[:tag_name]
      
      @tag_instance.save
      
      params[:id] = @tag_instance.id
      update
    end

  def destroy
    @tag_instance = Taggable.find params[:id]
    @tag_instance.destroy
    
    redirect_to( tags_url )
  end

  def edit
    @tag_instance =  Taggable.find params[:id]
    @dynamic_type = @tag_instance.dynamic_type
    @tag_attributes = @dynamic_type.dynamic_type_attributes
  end

  def index
    @tags = DynamicType.find_by_name("Tag").children_instances_recursive
  end

  def new
    if params[:type_id] != nil
      @dynamic_type = DynamicType.find params[:type_id]
    end
    if params[:type_name] != nil
      @dynamic_type = DynamicType.find_by_name params[:type_name]
    end
    ##actually this is not really needed

    ##if succesfuly found type
    #if @dynamic_type != nil
    #  @tag_instance = @dynamic_type.new_instance
    #end
    
    @tag_attributes = @dynamic_type.dynamic_type_attributes
    if params[:overlay]!=nil
      render :partial => 'new_min'
    end
  end

  def show
    @tag_instance = Tag.find params[:id]
    @taggings = @tag_instance.taggings_from
  end

  def update
    
     @tag_instance = Taggable.find params[:id]
     @dynamic_type = DynamicType.find_by_name @tag_instance.attributes["type"]
     @tag_instance.save

     @dynamic_type.dynamic_type_attributes.each do |attribute|
        @tag_instance[attribute.attribute_name] = params[:tag][attribute.attribute_name]
     end
    redirect_to( tag_url( params[:id]) )
  end

 

end
