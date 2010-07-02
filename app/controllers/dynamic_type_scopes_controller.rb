class DynamicTypeScopesController < ApplicationController
 
  def index
    @dynamic_type_scopes = DynamicTypeScope.all
  end

  def show
    @dynamic_type_scope = DynamicTypeScope.find( params[:id ])    
  end

  # GET /dynamic_type_scope/new
  # GET /dynamic_type_scope/new.xml
  def new
    @dynamic_type_scope = DynamicTypeScope.new
    @dynamic_type_scope.type_name = params[:type_name]
    if params[:overlay]!=nil
      render :partial => 'new_min'
    end
    #respond_to do |format|
    #  format.html # new.html.erb
    #  format.xml  { render :xml => @dynamic_type_scope }
    #end
  end

  def edit
    @dynamic_type_scope = DynamicTypeScope.find( params[:id ])  
    if params[:overlay]!=nil
      render :partial => 'edit_min'
    end
  end

  def update
    @dynamic_type_scope = DynamicTypeScope.find( params[:id ])    
    @dynamic_type_scope.update_attributes( params[:dynamic_type_scope])
    @dynamic_type_scope.save
    
    if params[:redirect_to_type ] != nil
      dynamic_type = DynamicType.find_by_name @dynamic_type_scope.type_name
      redirect_to(dynamic_type)
    else  
      redirect_to(@dynamic_type_scope)
    end
  end

  def create
    @dynamic_type_scope = DynamicTypeScope.new( params[:dynamic_type_scope])
    @dynamic_type_scope.save
    
    ##redirect_to(@dynamic_type_scope)
    if params[:redirect_to_type ] != nil
      dynamic_type = DynamicType.find_by_name @dynamic_type_scope.type_name
      redirect_to(dynamic_type)
    else  
      redirect_to(@dynamic_type_scope)
    end
  end

  def destroy
    @dynamic_type_scope = DynamicTypeScope.find( params[:id] )
    @dynamic_type_scope.destroy
    
    ##redirect_to( dynamic_type_scopes_url )
  
    if session[:redirect_to_this_type ] != nil 
      dynamic_type = DynamicType.find_by_name(session[:redirect_to_this_type ].name)
      puts "dynamic_type"
      puts session[:redirect_to_this_type ]
      session[:redirect_to_this_type ] = nil
      redirect_to(dynamic_type)
    else  
    	puts "dynamic_type_scope"
    	puts session[:redirect_to_this_type ]
      redirect_to( dynamic_type_scopes_url )
    end
  end

end
