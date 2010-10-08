xml.instruct! :xml, :version=>"1.0"

xml.tag!("rows") do
    @tags.each do |t|
        xml.tag!("row",{ "id" => t.id }) do
            xml.tag!("cell", t.attributes["type"] + "^" + url_for( :controller=>"tag", :action=>"dotag", :from_taggable_id=>t.id, :to_taggable_id=>@taggable_id )  + "^_top"  )
            
            if @return_taggable_id == nil
              xml.tag!("cell", t.name+ "^" +url_for( :controller=>"tag", :action=>"dotag", :from_taggable_id=>t.id, :to_taggable_id=>@taggable_id )  + "^_top" )
            else
              xml.tag!("cell", t.name+ "^" +url_for( :controller=>"tag", :action=>"dotag", :from_taggable_id=>t.id, :to_taggable_id=>@taggable_id, :return_taggable_id=>@return_taggable_id )  + "^_top" )
            end
            #xml.tag!("cell", "Add^"+ url_for( :controller=>"tag", :action=>"dotag", :from_taggable_id=>t.id, :to_taggable_id=>@taggable_id )  + "^_top" )
        end
    end
  end
  