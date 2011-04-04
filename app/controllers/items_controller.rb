require 'relation'

class ItemsController < ApplicationController
 

  def index
  
   @issues = Taggable.find :all, :conditions=>{:type=>"Issue"}

    respond_to do |format|
      format.html {render :layout=> false }# index.html.erb
      format.xml  #{ render :xml => @issues }
      format.json { render :json => @issues }      
    end
  end

  def show


	@item = Taggable.find :first, :conditions=>{:_id=>params[:id]}


	respond_to do |format|
		format.json {
			j = @item.to_hash
			
			@item.dynamic_type.dynamic_type_attributes.each do |attribute| 
				j[attribute.attribute_name] = @item.attributes[attribute.attribute_name]
			end
			
			j["url"] = url_for( @item ); 
			render :json => j }
		format.html { render :layout=> false }
	end

    # load infovis
    @onload = 'init('+params[:id]+',"SolvedBy");'
    
    @issue = Taggable.find :first, :conditions=>{:_id=>params[:id]}
    
    @tags = @issue.tags
    @taggings = @issue.taggings_to
    
    ## finds issues related with this issue by SolvedBy relation
    @alternatives = @issue.related_to("SolvedBy","Alternative")
    @alternative_relations = @issue.relations_to("SolvedBy")
    
    @alternative_relations.each do |r|
      t = r.tags("Decision")
    end
    
    @attributes = @issue.dynamic_type.dynamic_type_attributes
    
    @alternative_relations.each do |r|
      t=r.tags("Decision")
    end
    
    
    @taggable_id = @issue.id
    
   end

  def new
    
   @onload = "jQuery(\"#taggable_name\").focus();jQuery(\"textarea\").autoGrow();jQuery(\"textarea\").keydown(function(event) { if(event.keyCode==13 && event.ctrlKey == true) {jQuery(\"form\").submit();}})";
   
    ## this just goes and shows the form to be filled
    ## there is no need in creating new instance so far.
    @issue = DynamicType.find_by_name("Issue").new_instance
    
    if params[:overlay]!=nil
      render :partial => 'new_min'
    end
  end

  def edit
    @issue = Taggable.find params[:id]
    if params[:overlay]!=nil
      render :partial => 'edit_min'
    end
  end

  def create
    @issue = DynamicType.find_by_name("Issue").new_instance
    @issue.save
    params[:id] = @issue.id
    update
  end

  def update
     @issue = Taggable.find(params[:id])
     @issue_params = params[:issue] 
    
    updated = false
    
     if @issue_params == nil
       @issue_params = params 
     end


    if @issue_params["name"] != nil
        @issue.name = @issue_params["name"]
        updated = true
    end
    
    if @issue_params["Description"] != nil
        @issue["Description"] = @issue_params["Description"]
        updated = true
    end
           
        @issue.dynamic_type.dynamic_type_attributes.each do |attribute|
          if @issue_params[attribute.attribute_name] != nil
            @issue[attribute.attribute_name] = @issue_params[attribute.attribute_name]
           	updated = true
          end
        end 

	if updated 
		@issue.save
		Juggernaut.publish("/chats", @issue.id)
	end

    respond_to do |format|
     ## this didn't worked as some attributes are implemented as dynamic types attributes
        if params[:inplace] != nil
          format.html { render :text => params[params[:inplace]] }
        else          
          format.html { redirect_to(issue_url(@issue.id)) }
        end
        format.xml  { head :ok }
        format.js  { head :ok }
    end
  end

  def destroy
     @issue = Taggable.find(params[:id])
     @issue.destroy
    
    # clean up taggings and relations
    Relation.find(:all, :conditions=>{:tip=>params[:id]}).each do |r|
      r.destroy
    end
    
    #TODO: weak tags handling should be implemented there too
  
     respond_to do |format|
      format.html { redirect_to(issues_path) }
      format.xml  { head :ok }
     end
 end
end
