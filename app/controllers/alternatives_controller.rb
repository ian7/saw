
class AlternativesController < ApplicationController

  before_filter :authenticate_user!

   @decision_collection = nil;

  def index
    
#    puts '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' + current_user.email
    

		@alternatives = []	

  
   if params[:item_id] != nil 
		
    if params[:item_id]!='undefined'
		
    		@issue = Taggable.find params[:item_id] 
    		
    		
        a_collection = @issue.related_to("SolvedBy")



    		@decision_collection = Taggable.find :all, :conditions=>{:type=>"Decision"}
    		
    		a_collection.each do |alternative|			
    			#puts "sucks !"
    			@alternatives << to_hash_with_details( alternative )

        end
    else # item_id == "undefined"
      @alternatives = []
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
    
#    puts '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' + current_user.email
    

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
		notify(@issue.id)
		notify(@alternative.id)
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
      notify(params[:item_id])
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

   	notify( @alternative.id)

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
		
		# will store decision made by this user on this given relation
		@current_users_decision = nil
		
		# if given alternative is not related to the issue, then skip decisions because there are none
		if relation 
  		taggings = relation.relations_to("Tagging");

  		j_decisions = []
		
  		@decision_collection.each do |decision|
  		  related_decisions = Taggable.find(:all, :conditions=>{:origin=>decision.id, :tip=>relation.id })
  		    		  
  			j_decision = {}
  			j_decision["name"] = decision.name
  			
  			# this count shows wrong now...
  			#j_decision["count"] = related_decisions.count
  			j_decision["count"] = 0

  			j_details = []
  			related_decisions.each do |user_decision|
  			  
  			  # check if given decision really belongs to the projec we're considering
  			  if params[:project_id]
              p = Project.find params[:project_id]
#              puts '!!!!!!!!!!!!!!!! got project'
              project_tagging = Taggable.find :first, :conditions=>{:origin=>p.id, :tip=>user_decision.id}
              if project_tagging 
  			        j_decision["count"] = j_decision["count"] + 1
              else
                next
              end
    		  end
    		  
  			  j_user={}
  			  j_user['timestamp'] = user_decision.created_at
  			  if user_decision.author 
  			    j_user['email'] = user_decision.author.email
  			    j_user['user_id'] = user_decision.author.id
  			    j_user['decision_id'] = user_decision.id
            j_user['Rationale'] = user_decision["Rationale"]
  			    j_user['timestamp'] = user_decision.created_at.to_s
  			    
  			    rationales = user_decision.tags("Rationale")
  			    
  			    if rationales.count > 0 
  			      j_user['rationale'] = rationales[0].name
  			    end
# that would be nice to implement....
#  			    j_users['uri'] = url_for( user_decision.author )
  			  end
  			  j_details << j_user
  			end
  			j_decision['details'] = j_details
#        j_decision['user_details'] = j_users
  			j_decision["decision_tag_id"] = decision.id
  			j_decision["color"] = decision.color
  			j_decisions << j_decision
			
  			if current_user 
  			  rds = related_decisions.where(:author_id=>current_user.id)
  			  #current_users_decision = related_decisions.where(:author_id=>current_user.id).first
#          puts "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + c.count.to_s


          rds.all.each do |rd|
            if params[:project_id]
               p = Project.find params[:project_id]  
               if rd.tags.index { |t| t.type=="Project" && t.id == p.id }  
                 @current_users_decision = rds.first
               end
            else
              @current_users_decision = rds.first
            end
          end

  			end
  		end
		
  		j_alternative["decisions"] = j_decisions
		  @your_decision = {}
  		
  		if @current_users_decision
  		  # that's lame - i should use mongoid relations !
  		  decision = Taggable.find :first, :conditions=>{ :id=>@current_users_decision.origin }
   		  @your_decision["name"] = decision.name
   		  @your_decision["decision_tag_id"] = decision.id   		  
   		  @your_decision["color"] = decision.color
   		  @your_decision["tagging_id"] = @current_users_decision.id
   		else
   		  # if no decision was found...
   		  @your_decision["name"] = nil
   		  @your_decision["decision_tag_id"] = nil
   		  @your_decision["color"] = nil
   		  @your_decision["tagging_id"] = nil
   		end

 		  j_alternative["your_decision"] = @your_decision
   		
		
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
	
	if params[:project_id]
  	j_alternative["project_id"] = params[:project_id]
	end
	
	return j_alternative			
 end
end
