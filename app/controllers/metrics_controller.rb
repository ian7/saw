class MetricsController < ApplicationController
  def choice
  end

  def descriptiveness
    
    # in case there is only one node specified, that might render some nice node-centric vis
    id = params[:id]  
    @descriptiveness_level = 0
    if id != nil
      t=Taggable.find id
      @descriptiveness_level = t.tags.length
    end
    
    # in case there is node list, then return json
    
    nodes = params[:nodes]
    codec = ActiveSupport::JSON
    
    if nodes != nil
      nodes_array = codec.decode(nodes)
      retval = {}
      
      nodes_array.each do |node|
        
        if Taggable.exists? node
          t = Taggable.find node
          retval[node] = t.tags.length  
        end
      end
      
      render :json => retval
      end
  end

  def complexity
  end

end
