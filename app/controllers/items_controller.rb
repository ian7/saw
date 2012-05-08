require 'relation'
require 'rtf'

class ItemsController < ApplicationController
 
  # that's bad
  before_filter :authenticate_user!
 

  def index

#    puts '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' + current_user.email

   # in case we're sub-resourced with a project
   if params[:project_id]
     @project = TreeTag.find params[:project_id]
     @issues = @project.related_from("Tagging",'Issue')
   else
     @issues = Taggable.find :all, :conditions=>{:type=>"Issue"}
   end
  

    respond_to do |format|
      format.html {render :layout=> true }# index.html.erb
      format.xml  #{ render :xml => @issues }
      format.json { 
        j=[]
        @issues.each do |i|
          ii = i.to_json;
          ii['item_url'] = url_for( i )
          
          if params[:project_id]
            ii['project_id'] = params['project_id'];
          end

          # if asked, we should add list of tags
          if params[:with_tags]
            it = []
            i.tags.each do |t|
              tj = t.to_json
              it << tj
            end
            ii['tags'] = it
          end
          j << ii
        end

        # this is dependent on the existance of x and y
        # and will crash if either x or y doesn't exist
        j_sorted=j.sort {|y,x|
          begin
            Taggable.find(x['id']).updated_at <=> Taggable.find(y['id']).updated_at
          rescue
            0
          end
        }

        render :json => j_sorted }      
      format.tex {
        render :issues => @issues
      }
      format.rtf {
        document = RTF::Document.new(RTF::Font.new(RTF::Font::ROMAN, 'Times New Roman'))
        ps_alternatives = RTF::ParagraphStyle.new
#        ps_alternatives.left_indent = 1000
        
        h = RTF::HeaderNode.new(document)
        styles = {}
        styles['PS_ISSUE'] = RTF::ParagraphStyle.new
        styles['PS_ISSUE'].left_indent = 200
        styles['PS_ALTERNATIVE'] = RTF::ParagraphStyle.new
        styles['PS_ALTERNATIVE'].left_indent = 400
        styles['PS_DECISION'] = RTF::ParagraphStyle.new
        styles['PS_DECISION'].left_indent = 600

        @decision_collection = Taggable.find :all, :conditions=>{:type=>"Decision"}

        document << "Project report follows"
        document.line_break
        document.line_break

        document.paragraph( styles['PS_ISSUE'] ) do |ip|

          @issues.each do |i|

            i.to_rtf( ip )
            
            alternatives = i.related_to "SolvedBy"
            
            ip.paragraph(styles['PS_ALTERNATIVE']) do |ap|
              alternatives.each do |a|
                a.to_rtf(ap)


                relation = Taggable.find(:first, :conditions=>{:origin=>a.id, :tip=>i.id})
                j_decisions = []
              
                ap.paragraph( styles['PS_DECISION'] ) do |dp|
                  @decision_collection.each do |decision|
                    related_decisions = Taggable.find(:all, :conditions=>{:origin=>decision.id, :tip=>relation.id })
                            
                    #p << decision.name.to_s + ":"
                    related_decisions.each do |user_decision|
                      
                      # check if given decision really belongs to the projec we're considering
                      if params[:project_id]
                          pp = Project.find params[:project_id]
                          project_tagging = Taggable.find :first, :conditions=>{:origin=>pp.id, :tip=>user_decision.id}
                          if project_tagging 
                             #              j_decision["count"] = j_decision["count"] + 1
                          else
                            next
                          end
                      end
                      #debugger
                      dp.bold { |b| b << "Decision: "}
                      dp.foreground('red') { |c| c << decision.name.to_s }
                      dp << ", "
                      dp.bold { |b| b << "User: " }
                      dp << user_decision.author.email.to_s + ", "
                      dp.bold { |b| b << "Rationale: " }
                      dp << user_decision["Rationale"].to_s + ", "
                      dp.bold { |b| b << "Time: " }
                      dp << user_decision.created_at.to_s 
                      dp.line_break
                    end
                  end
                end
              end
            end
          end
        end
  
        #send_file document.to_rtf, :type=>"text/richtext"
        render :text => document.to_rtf
      }

    end
  end

  def show


	@item = Taggable.find :first, :conditions=>{:_id=>params[:id]}


	respond_to do |format|
		format.json {
		  if @item 	 
		    j = @item.to_json;
		    j['item_url'] = url_for( @item )
  			render :json => j 
		  else
		    render :json => {}
		  end
      }
		format.html { render :layout=> false }
	end

=begin

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
=end    
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
    
    if params[:project_id] 
      project = TreeTag.find params[:project_id]
      if project
        t = Tagging.new
        t.type = "Tagging"
        t.tip = @issue.id
        t.origin = project.id
        t.save
      end
    end
    
    
    if params[:project_id]
      Juggernaut.publish("/chats",params[:project_id])
    end
    
    update
  end

  def update
    
    
    puts '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ' + current_user.email
    
     if params[:id] 
         @issue = Taggable.find(params[:id])
     end

     if params[:_id] 
         @issue = Taggable.find(params[:_id])
     end


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
	end

	Juggernaut.publish("/chats", @issue.id)

    respond_to do |format|
     ## this didn't worked as some attributes are implemented as dynamic types attributes
        if params[:inplace] != nil
          format.html { render :text => params[params[:inplace]] }
        else          
          format.html { redirect_to(issue_url(@issue.id)) }
        end
        format.xml  { head :ok }
        format.js  { head :ok }
        format.json { render :json => @issue.to_json }
    end
  end

  def destroy
    # changed behaviour to unkinking
    # instead of deleting 

    # @issue = Taggable.find(params[:id])
    # @issue.destroy

     if params[:project_id]
        Juggernaut.publish("/chats",params[:project_id])
      end
    
    # clean up taggings and relations
    Relation.find(:all, :conditions=>{:tip=>params[:id], :origin=>params[:project_id]}).each do |r|
      r.destroy
    end
    
    #TODO: weak tags handling should be implemented there too
  
     respond_to do |format|
      format.html { redirect_to(issues_path) }
      format.xml  { head :ok }
     end
 end
end
