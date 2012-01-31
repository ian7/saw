class RController < ApplicationController
  def index
    if not params[:type]
      params[:type] = "Issue"
    end

    j=[]
    if params[:type] 
      Taggable.find(:all, :conditions=>{ :type=>params[:type] }).each do |taggable|
        j << taggable.to_json
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
        render :json => item.to_json
      }
    end
  end

  def update
  end

  def delete
  end

end
