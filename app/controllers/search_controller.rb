class SearchController < ApplicationController

  def search
    conditions = {}
    conditions[:name] = Regexp.new(params[:keyword], (Regexp::IGNORECASE | Regexp::MULTILINE))
    if params[:type] 
      conditions[:type] = params[:type]
    end
    result = Taggable.find(:all, :conditions=> conditions )
    # limit to first 10 searches
    result = result[0..10]
    respond_to do |format|
  		format.json {	
  		  if( result )
  		    render :json => result.to_json(:only=>[:name,:_id,:type])
  		  else
  		    render :json => []
  		  end
  		    }
     end
  end
  def index
    conditions = {}
    if params[:type] 
      conditions[:type] = params[:type]
    end
    result = Taggable.find(:all, :conditions=> conditions )
    # limit to first 10 searches
    result = result[0..10]
    respond_to do |format|
  		format.json {	
  		  if( result )
  		    render :json => result.to_json(:only=>[:name,:_id,:type])
  		  else
  		    render :json => []
  		  end
  		    }
     end    
  end
end
