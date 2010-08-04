class TaggablesController < ApplicationController
      layout nil;

  include TaggablesHelper

  def show
    @taggable_instance = Taggable.find(params[:id])
    respond_to do |format|
      format.html
      format.json { render :json => @taggable_instance }
#      format.xml  { render :xml => taggable_instance.relations_from }
      end
  end
  
  def index
    
  end
  
  def search
    if 0 == params['criteria'].length
      @items = nil
    else
      @items = Taggable.find(:all, :conditions => [ 'LOWER(name) LIKE ?','%' + params['criteria'].downcase + '%' ])
      @mark_term = params['criteria']
    end
    #render_without_layout
  end
end
