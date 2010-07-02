class DynamicTypesController < ApplicationController

  def index
    @dynamic_types = DynamicType.all
    @dynamic_types.sort
  end

  def show
    @dynamic_type = DynamicType.find(params[:id ])  
    @dynamic_type_attributes = @dynamic_type.dynamic_type_attributes
    @dynamic_type_scopes = @dynamic_type.dynamic_type_scopes
  end

  def new
    ## nothing happens there - just empty form is displayed
  	@dynamic_type = DynamicType.new
    render :partial => 'new_min'
  end

  def edit
    @dynamic_type = DynamicType.find( params[:id ])   
    render :partial => 'edit_min'
  end

  def update
    @dynamic_type = DynamicType.find( params[:id ])    
    @dynamic_type.update_attributes( params[:dynamic_type])
    @dynamic_type.save
    redirect_to(@dynamic_type)
  end

  def create
    @dynamic_type = DynamicType.new( params[:dynamic_type])
    @dynamic_type.save
    redirect_to( dynamic_types_url )
  end

  def destroy
    @dynamic_type = DynamicType.find( params[:id] )
    @dynamic_type.destroy
    
    redirect_to( dynamic_types_url )
  end

end
