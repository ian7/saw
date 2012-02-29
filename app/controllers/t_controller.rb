class TController < ApplicationController
 def index

    j=[]
    DynamicType.all.each do |t|
        jj=t
       	jj["count"] = Taggable.find(:all,:conditions=>{:type=>t.name}).count
        #.to_json
        # fairly crucial element
#        jj["url"] = "/t/"+t._id.to_s
        j << jj
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
  end

  def delete
  end

end
