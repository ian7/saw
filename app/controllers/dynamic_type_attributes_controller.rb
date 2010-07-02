class DynamicTypeAttributesController < ApplicationController

  def index
    @dynamic_type_attributes = DynamicTypeAttribute.all
  end

  def show
    @dynamic_type_attribute = DynamicTypeAttribute.find( params[:id ])    
  end

  def new
    @dynamic_type_attribute = DynamicTypeAttribute.new
    @dynamic_type_attribute.type_name = params[:type_name]
    if params[:overlay]!=nil
      render :partial => 'new_min'
    end

    #respond_to do |format|
    #  format.html # new.html.erb
    #  format.xml  { render :xml => @dynamic_type_attribute }
    #end
  end

  def edit
    @dynamic_type_attribute = DynamicTypeAttribute.find( params[:id ])
    if params[:overlay]!=nil
      render :partial => 'edit_min'
    end
  end

  def update
    @dynamic_type_attribute = DynamicTypeAttribute.find( params[:id ])    
    @dynamic_type_attribute.update_attributes( params[:dynamic_type_attribute])
    @dynamic_type_attribute.save
    
    if params[:redirect_to_type ] != nil
      dynamic_type = DynamicType.find_by_name @dynamic_type_attribute.type_name
      redirect_to(dynamic_type)
    else  
      redirect_to(@dynamic_type_attribute)
    end
  end

  def create
    @dynamic_type_attribute = DynamicTypeAttribute.new( params[:dynamic_type_attribute])
    @dynamic_type_attribute.save
    
   ## redirect_to(@dynamic_type_attribute)
    if params[:redirect_to_type ] != nil
      dynamic_type = DynamicType.find_by_name @dynamic_type_attribute.type_name
      redirect_to(dynamic_type)
    else  
      redirect_to(@dynamic_type_attribute)
    end
  end

  def destroy
    @dynamic_type_attribute = DynamicTypeAttribute.find( params[:id] )
    @dynamic_type_attribute.destroy
    
    if session[:redirect_to_this_type ] != nil 
      dynamic_type = DynamicType.find_by_name(session[:redirect_to_this_type ].name)
      session[:redirect_to_this_type ] = nil
      redirect_to(dynamic_type)
    else  
    	redirect_to( dynamic_type_attributes_url )
    end
  end
end
