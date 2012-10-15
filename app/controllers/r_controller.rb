class RController < ApplicationController

#  before_filter :authenticate_user!

  def index
    if not params[:type]
      params[:type] = "Issue"
    end

    j=[]
    if params[:type] 
      Taggable.find(:all, :conditions=>{ :type=>params[:type] }).each do |taggable|
        t= taggable.to_json
        # fairly crucial element
        t["url"] = "/r/"+taggable.id.to_s
        j << t
      end
    end
    respond_to do |format|
      format.json { 
        render :json => j
      }
      format.html {
       # render :html;
      } 
  
    end  
  end

  def show
    item = Taggable.find params[:id]
    
    respond_to do |format|
      format.json { 
        j=item.to_json
        j["related_from"] = item.related_from.sort_by {|x| x.type}
        j["related_to"] = item.related_to.sort_by {|x| x.type}
        render :json => j
      }
    end
  end

  def update   
  
    r = Taggable.find params["id"]
    notify( r.id)

# that doesn't belong to the attributes, so it needs to be adjusted manually
    r.name = params[:name]
    r["Description"] = params[:Description]
         
    r.dynamic_type.dynamic_type_attributes.each do |attribute|
      if params[attribute.attribute_name] != nil
        r[attribute.attribute_name] = params[attribute.attribute_name]
      end
    end 

    r.save

  notify( r.id)

    respond_to do |format|
        format.json { render :json => r.to_json }
    end
  end

  def destroy

    r = Taggable.find params[:id]

    if r 
      notify( r.id )
## somehow this fails too...
#      notify( r.dynamic_type.id.to_s)

      r.destroy
    end
    respond_to do |format|
        format.json { render :json => {} }
    end


  end

  def create
    r = DynamicType.find_by_name(params[:type]).new_instance
    r.save
    params[:id] = r.id



    if params[:project_id] 
      project = TreeTag.find params[:project_id]
      if project
        t = Tagging.new
        t.type = "Tagging"
        t.tip = r.id
        t.origin = project.id
        t.save
      end
    end

   ######## this fails because types are not taggables.

   # notify( r.dynamic_type.id.to_s)

=begin  
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
      notify(params[:project_id])
    end
=end
    update    
  end

  def attribute
    r = Taggable.find params[:id]
    a = r.attributes[ params[:attribute] ]
    
#    puts params

    respond_to do |format|
        format.any { render :text => a }
    end

  end
  def setAttribute
    # this is fairly unbelievable, but this is the method to retrieve payload from the put call
    value = params.first[0].to_s

    r = Taggable.find params[:id]
    r[ params[:attribute] ] = value
    r.save

    # blow notify
    #notify(params[:id])
    ring(params[:id],2,'setAttribute')

    respond_to do |format|
        format.json { render :json => value }
    end
  end
end
