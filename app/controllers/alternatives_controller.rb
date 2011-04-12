
class AlternativesController < ApplicationController
	
   @decision_collection = nil;

  def index
  
   if params[:item_id] != nil
		
		
		@issue = Taggable.find params[:item_id] 
     	a_collection = @issue.related_to("SolvedBy")

		@alternatives = []	

		@decision_collection = Taggable.find :all, :conditions=>{:type=>"Decision"}
		
		a_collection.each do |alternative|			
			#puts "sucks !"
			@alternatives << to_hash_with_details( alternative )
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
    
    @alternative = Taggable.find params[:id]
	@decision_collection = Taggable.find :all, :conditions=>{:type=>"Decision"}


	respond_to do |format|
	  format.html { 
	  	    @onload = 'init('+params[:id]+',"SolvedBy");'
    
		    @tags = @alternative.tags
		    @taggings = @alternative.taggings_to
		    
		    ## finds issues related with this alternative by SolvedBy relation
		    @issues = @alternative.related_from("SolvedBy","Issue")
		    @taggable_id = @alternative.id
		    @attributes = @alternative.dynamic_type.dynamic_type_attributes
	  }# index.html.erb
	  format.xml  { 
	  		render :xml => to_hash_with_details( @alternative)
	  		}
	  format.json { render :json =>  to_hash_with_details( @alternative) }
    end


    
   end

  def new
    
    # check whenever we're in issue or item route
    if params[:item_id]
    	@issue_id = params[:item_id]
    end
    
    if params[:issue_id]
    	@issue_id = params[:item_id]
    end

	if @issue_id
		 	@issue = Taggable.find @issue_id
	end

    @onload = "jQuery(\"#taggable_name\").focus();jQuery(\"textarea\").autoGrow();jQuery(\"textarea\").keydown(function(event) { if(event.keyCode==13 && event.ctrlKey == true) {jQuery(\"form\").submit();}})";
    @alternative = DynamicType.find_by_name("Alternative").new_instance		
   
    # if we are really a composite resource then _save_it_ and relate it immediately 
	if @issue
		# now it gets a valid ID
		@alternative.save 
		# so we can relate it 
		relation = DynamicType.find_by_name("SolvedBy").new_instance
		relation.origin = @alternative.id
		relation.tip = @issue.id
		relation.save
		Juggernaut.publish("/chats",@issue.id)
		Juggernaut.publish("/chats",@alternative.id)
	end
    
     respond_to do |format|
        format.html {     
        	if params[:overlay]!=nil
			     render :partial => 'new_min'
			end
			}
        format.xml  { render :xml => @alterantive }
        format.json { render :json => @alternative }
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
    
    if params[:item_id] != nil
      solvedBy_relation = DynamicType.find_by_name("SolvedBy").new_instance
                       
      solvedBy_relation.origin = @alternative.id
      solvedBy_relation.tip = Taggable.find(params[:item_id]).id
      solvedBy_relation.save
      Juggernaut.publish("/chats",params[:item_id])
    end
    
    #TODO: unit test to test related issues.
        
    params[:id] = @alternative.id
    update
  end

  def update
    
      @alternative = Taggable.find(params[:id])

        @alternative_params = params[:issue] 

       updated = false

        if @alternative_params == nil
          @alternative_params = params 
        end


       if @alternative_params["name"] != nil
           @alternative.name = @alternative_params["name"]
           updated = true
       end

       if @alternative_params["Description"] != nil
           @alternative["Description"] = @alternative_params["Description"]
           updated = true
       end

           @alternative.dynamic_type.dynamic_type_attributes.each do |attribute|
             if @alternative_params[attribute.attribute_name] != nil
               @alternative[attribute.attribute_name] = @alternative_params[attribute.attribute_name]
              	updated = true
             end
           end 

   	if updated 
   		@alternative.save
   	end

   	Juggernaut.publish("/chats", @alternative.id)

       respond_to do |format|
        ## this didn't worked as some attributes are implemented as dynamic types attributes
           if params[:inplace] != nil
             format.html { render :text => params[params[:inplace]] }
           else          
             format.html { redirect_to(issue_url(@alternative.id)) }
           end
           format.xml  { head :ok }
           format.js  { head :ok }
           format.json { 
             	@decision_collection = Taggable.find :all, :conditions=>{:type=>"Decision"}
             render :json => to_hash_with_details( @alternative ) }
       end
  end

  def destroy
     @alternative = Taggable.find(params[:id])
     @alternative.destroy
    
    # clean up taggings and relations
    Relation.find(:all, :conditions=>{:tip=>params[:id]}).each do |r|
      r.destroy
    end
    
    if params[:item_id]
      Juggernaut.publish( "/chats", params[:item_id] )
    end
    #TODO: weak tags handling should be implemented there too
  
     respond_to do |format|
      format.html { redirect_to(alternatives_url) }
      format.xml  { head :ok }
      format.json { render :json=>{} }
     end
 end
 
 def to_hash_with_details( alternative )
	j_alternative = alternative.to_hash 	
 	
 	if params[:item_id]
		@issue = Taggable.find params[:item_id] 
	
			
		relation = Taggable.find(:first, :conditions=>{:origin=>alternative.id, :tip=>@issue.id})
		
		# if given alternative is not related to the issue, then skip decisions because there are none
		if relation 
  		taggings = relation.relations_to("Tagging");

  		j_decisions = []
		
  		@decision_collection.each do |decision|
  			j_decision = {}
  			j_decision["name"] = decision.name
  			j_decision["count"] = Taggable.find(:all, :conditions=>{:origin=>decision.id, :tip=>relation.id }).count
  			j_decision["decision_tag_id"] = decision.id
  			j_decisions << j_decision
  		end
		
  		j_alternative["decisions"] = j_decisions
		
  		@relation = Taggable.find :first, :conditions=>{:tip=>@issue.id, :origin=>alternative.id }
		
  		j_alternative["relation_id"] = @relation.id
  		j_alternative["relation_url"] = taggable_url( @relation )
  	end	
  end
	

	j_alternative["id"]=alternative._id
	
	alternative.dynamic_type.dynamic_type_attributes.each do |attribute| 
		j_alternative[attribute.attribute_name] = alternative.attributes[attribute.attribute_name]
	end
	
	j_alternative["alternative_url"] = alternative_url( alternative )
	
	return j_alternative			
 end
end
