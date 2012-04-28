class TController < ApplicationController
 def index

    j=[]
    dts = DynamicType.all
    dta = dts.sort_by {|x| x.name}
    dta.each do |t|
   
        jj=t
       	jj["count"] = Taggable.find(:all,:conditions=>{:type=>t.name}).count
        jj["attributes"] = []
        
        t.dynamic_type_attributes.each do |a|
          jj["attributes"] << a.attribute_name
        end
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
        #render :html;
      } 
  
    end  
  end

  def show
    dt = DynamicType.find :first, :conditions=>{:name=>params[:id]}
    
    respond_to do |format|
      format.json { 
        j=dt

        ar=[]
        ar.
        dt.dynamic_type_attributes.each do |a|
          ar << a.attribute_name
        end
        j["attributes"]=ar
        jj=j.to_json
        render :json => jj
      }
    end
  end

  def name
    dt = DynamicType.find :first, :conditions=>{:name=>params[:id]}
    respond_to do |format|
      format.json {
        render :json => dt.to_json
      }
    end
  end

  def update
  end

  def delete
  end

end
