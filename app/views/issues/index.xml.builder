  xml.instruct! :xml, :version=>"1.0"

 xml.tag!("rows") do
    @issues.each do |i|
        xml.tag!("row",{ "id" => i.id }) do
            xml.tag!("cell", i.id.to_s + "^" + issue_url(i.id) + "^_top")
            xml.tag!("cell", i.name + "^" + issue_url(i.id) + "^_top")
            
            # description
            
            if i["Description"]!= nil
              xml.tag!("cell", i["Description"].value + "^" + issue_url(i.id) + "^_top");
            else
              xml.tag!("cell","(none)" + "^" + issue_url(i.id) + "^_top");
            end
            
            # alternatives count
            decided_alternatives = 0
            @alternative_relations = i.relations_to("SolvedBy")
    
            @alternative_relations.each do |r|
              if r.tags("Decision").size > 0
                decided_alternatives = decided_alternatives + 1
              end
            end
            xml.tag!("cell", @alternative_relations.size)            
            xml.tag!("cell",  decided_alternatives)
        end
    end
  end