xml.instruct! :xml, :version=>"1.0"

 xml.tag!("rows") do

 @tags.each do |t|
        xml.tag!("row",{ "id" => t.id }) do
            xml.tag!("cell", t.name )  #+ "^" + issue_url(i.id) + "^_top")
            xml.tag!("cell", t.type )
            xml.tag!("cell","x")            
        end
    end
  end

