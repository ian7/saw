class TController < ApplicationController

before_filter :authenticate_user!

 def index

    j=[]
    dts = DynamicType.all
    dta = dts.sort_by {|x| x.name}
    dta.each do |t|
   
        jj=t.to_hash_recursive
       	jj["count"] = Taggable.find(:all,:conditions=>{:type=>t.name}).count
       
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
        j=dt.to_hash_recursive
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
