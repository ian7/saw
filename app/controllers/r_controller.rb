class RController < ApplicationController
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
        j["related_from"] = item.related_from
        j["related_to"] = item.related_to
        render :json => j
      }
    end
  end

  def update   

    r = Taggable.find params["id"]

# that doesn't belong to the attributes, so it needs to be adjusted manually
    r.name = params[:name]
    r["Description"] = params[:Description]
         
    r.dynamic_type.dynamic_type_attributes.each do |attribute|
      if params[attribute.attribute_name] != nil
        r[attribute.attribute_name] = params[attribute.attribute_name]
      end
    end 

    r.save

  Juggernaut.publish("/chats", r.id)

    respond_to do |format|
        format.json { render :json => r.to_json }
    end
  end

  def delete
  end

end
