module TaggingsHelper
  def tagging_url( tagging )
    url_for( :controller=>'items', :action=>"show", :id=>tagging.id );
  end
end
def tagging_url( tagging )
  url_for( :controller=>'items', :action=>"show", :id=>tagging.id );
end
