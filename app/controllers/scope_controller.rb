class ScopeController < ApplicationController
  def type
  	if not params[:type_name]
      params[:type_name] = "Issue"
    end

    j=[]
    if params[:type_name] 
      Taggable.find(:all, :conditions=>{ :type=>params[:type_name] }).each do |taggable|
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

end
