#require "metrics_helper"

class MetricsController < ApplicationController


  def queryHandler   
    id = params[:id]  
    @value = 0
    if id != nil
      t=Taggable.find id
      # @value = metric( id )
      @value = yield id
    end
    
    # in case there is node list, then return json
    
    nodes = params[:nodes]
    codec = ActiveSupport::JSON
    
    if nodes != nil
      nodes_array = codec.decode(nodes)
      retval = {}
      
      nodes_array.each do |node|
        
        if Taggable.exists? node
          #t = Taggable.find node
          retval[node] = yield node   
        end
      end
    end
    return retval  
  end

  def classification
    retval = queryHandler { |x| Metrics.classification x }

    respond_to do |format|      
      format.json { render :json => retval; }
    end
  end

  def descriptiveness
    retval = queryHandler { |x| Metrics.descriptiveness x }

    respond_to do |format|      
      format.json { render :json => retval; }
    end
  end

  def complexity
    retval = queryHandler { |x| Metrics.complexity x }

    respond_to do |format|      
      format.json { render :json => retval; }
    end
  end
    
  def completeness
    retval = queryHandler { |x| Metrics.completeness x }

    respond_to do |format|      
      format.json { render :json => retval; }
    end  
  end

  def definiteness
    retval = queryHandler { |x| Metrics.definiteness x }

    respond_to do |format|      
      format.json { render :json => retval; }
    end  
  end


  def list
    h=["classification","descriptiveness","complexity","completeness","definiteness"];
    respond_to do |format|      
     format.json { render :json => h }
    end
  end
end
