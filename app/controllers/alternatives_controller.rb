
class AlternativesController < ApplicationController
	
  def decide
  	if params[:issue_id]
  		@issue = Taggable.find params[:issue_id]
  	end  	
  	
  	if params[:item_id]
  		@issue = Taggable.find params[:item_id]
  	end  	
	
	@alternative = Taggable.find params[:alternative_id]
	
	@decision = Taggable.find :first, :conditions=>{:type=>"Decision", :name=>params[:decision]}
	
	
	#if everything went well, then let's make a decisison
	if @issue && @alternative && @decision
		@relation = Taggable.find :first, :conditions=>{:origin=>@issue.id, :tip=>@alternative.id } 
		Tagging.new 		
	end 	

  end	

  def index
  	
  	
  	
  	
  
   if params[:item_id] != nil
   		@issue = Taggable.find params[:item_id] 
		a_collection = @issue.related_to("SolvedBy")
		
		decision_collection = Taggable.find :all, :conditions=>{:type=>"Decision"}
		
		@alternatives = []	
		
		
		a_collection.each do |alternative|
			relation = Taggable.find(:first, :conditions=>{:origin=>alternative.id, :tip=>@issue.id})
			taggings = relation.relations_to("Tagging");
			# TODO: here more logics is required !
			
			
			j_alternative = alternative.to_hash
			j_alternative["id"]=alternative._id
			
			alternative.dynamic_type.dynamic_type_attributes.each do |attribute| 
				j_alternative[attribute.attribute_name] = alternative.attributes[attribute.attribute_name]
			end
			
			j_decisions = []
			
			decision_collection.each do |decision|
				j_decision = {}
				j_decision["name"] = decision.name
				j_decision["count"] = Taggable.find(:all, :conditions=>{:origin=>decision.id, :tip=>relation.id }).count
				j_decisions << j_decision
			end
			
			j_alternative["decisions"] = j_decisions
			
			@relation = Taggable.find :first, :conditions=>{:tip=>@issue.id, :origin=>alternative.id }
			
			j_alternative["relation_id"] = @relation.id
			j_alternative["relation_url"] = taggable_url( @relation )
			j_alternative["alternative_url"] = alternative_url( alternative )
			
			#puts "sucks !"
			@alternatives << j_alternative
		end
		
   else
	   @alternatives = Taggable.find :all, :conditions=>{:type=>"Alternative"}   	
   end	
  	
   
   if( params[:overlay] == nil ) 
      respond_to do |format|
        format.html # index.html.erb
        format.xml  { render :xml => @alterantives }
        format.json { render :json => @alternatives }
      end
   else
    render :partial=>"list_min"
   end
  end

  def show
    # load infovis
    @onload = 'init('+params[:id]+',"SolvedBy");'
    
    @alternative = Taggable.find params[:id]
    
    @tags = @alternative.tags
    @taggings = @alternative.taggings_to
    
    ## finds issues related with this alternative by SolvedBy relation
    @issues = @alternative.related_from("SolvedBy","Issue")
    @taggable_id = @alternative.id
    @attributes = @alternative.dynamic_type.dynamic_type_attributes
    
   end

  def new
    
    @related_issue_id = params[:id]
    
    @onload = "jQuery(\"#taggable_name\").focus();jQuery(\"textarea\").autoGrow();jQuery(\"textarea\").keydown(function(event) { if(event.keyCode==13 && event.ctrlKey == true) {jQuery(\"form\").submit();}})";
    @alternative = DynamicType.find_by_name("Alternative").new_instance
    
    if params[:overlay]!=nil
      render :partial => 'new_min'
    end
    ## this just goes and shows the form to be filled
    ## there is no need in creating new instance so far.
  end

  def edit
    @alternative = Taggable.find params[:id]
    if params[:overlay]!=nil
      render :partial => 'edit_min'
    end
  end

  def create
    @alternative = DynamicType.find_by_name("Alternative").new_instance
    @alternative.save   
    
    if params[:related_issue_id] != nil
      solvedBy_relation = DynamicType.find_by_name("SolvedBy").new_instance
                       
      solvedBy_relation.origin = @alternative.id
      solvedBy_relation.tip = params[:related_issue_id]
      solvedBy_relation.save
    end
    
    #TODO: unit test to test related issues.
        
    params[:id] = @alternative.id
    update
  end

  def update
     @alternative = Taggable.find(params[:id])


    respond_to do |format|
     ## this didn't worked as some attributes are implemented as dynamic types attributes
     
     #TODO: maybe i should rework it to make update_attributes work again 
     #@alternative.update_attributes(params[:alternative])
     
        @alternative.name = params[:alternative]["name"]
        @alternative.save
        @alternative["Description"] = params[:alternative]["description"]
        
        @alternative.dynamic_type.dynamic_type_attributes.each do |attribute|
          @alternative[attribute.attribute_name] = params[:alternative][attribute.attribute_name]
        end 
        
        if params[:related_issue_id] != nil
          format.html { redirect_to(issue_url(params[:related_issue_id])) }
        else      
          format.html { redirect_to(alternative_url(@alternative.id)) }
        end
        
        format.xml  { head :ok }
    end
  end

  def destroy
     @alternative = Taggable.find(params[:id])
     @alternative.destroy
    
    # clean up taggings and relations
    Relation.find(:all, :conditions=>{:tip=>params[:id]}).each do |r|
      r.destroy
    end
    
    #TODO: weak tags handling should be implemented there too
  
     respond_to do |format|
      format.html { redirect_to(alternatives_url) }
      format.xml  { head :ok }
     end
 end
end
