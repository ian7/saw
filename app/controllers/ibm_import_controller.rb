class IBMImportController < ActionController::Base
    def self.load( path="" )
      @importer = User.find :first, :conditions=>{:email=>"importer@sonyx.net"}
      
      puts "importing user: " + @importer.email
      puts "loading dir: "+path
      ## mind the order of loading
      self.load_topic_groups path
      self.load_decisions path
      self.load_alternatives path
      self.load_dependencies path
    end


    ## incomplete - taggingging issues with outcomes kind of doesn't make sense. 

    ## that should be represented by the decisions
    def self.load_outcomes( path )
      f = File.open(path+"ad_outcomes.txt")
    
      f.each_line do |line|
        split_line = line.split(":::")
        
      if split_line.size != 9
         puts "Outcomes: Wrong number of separators: "+split_line.size+ "/13"
         next
       end
       
      end     
    end

    def self.load_dependencies( path )
      f = File.open(path+"ad_dependencys.txt") # dependencies.txt ;)
    
      f.each_line do |line|
        split_line = line.split(":::") 
    
    #  puts split_line.size
      
       if split_line.size != 9
         puts "Dependencies: Wrong number of separators: "+split_line.size+ "/9"
         next
       end

       ## find the origin of the relation by it's IBM-ID
       origin_tag = Tag.find :first, :conditions=>{:type=>"IBM-ID", :name=>split_line[1]}
       
       if origin_tag != nil
          origin_asset = origin_tag.taggable
       else
          puts "IBM-ID: "+split_line[1]+" wasn't found."
          next
       end

       ## find the tip of the relation by it's IBM-ID
       tip_tag = Tag.find :first, :conditions=>{:type=>"IBM-ID", :name=>split_line[3]}
       
       if tip_tag != nil
         tip_asset = tip_tag.taggable
       else
          puts "IBM-ID: "+split_line[1]+" wasn't found."
          next
       end

       if origin_asset != nil && tip_asset != nil
         ## i make this relation without name - should be ok.
         influences_instance = DynamicType.find_by_name("Influences").new_instance(nil,@importer)
         influences_instance.origin = origin_asset.id
         influences_instance.tip = tip_asset.id         
         influences_instance.save

         # SOA project assignment
         tag_or_create(influences_instance,"Project","IBM adWiki SOA sample")
         
         
         ## this relation is going to get an IBM-ID too
         id_instance = DynamicType.find_by_name("IBM-ID").new_instance(split_line[0],@importer)
         id_instance.save

         # SOA project assignment
         tag_or_create(id_instance,"Project","IBM adWiki SOA sample")
         
         #TODO: that's nasty - rework it !
         tagging_instance = Tagging.new
         tagging_instance.type = "Tagging"
         tagging_instance.origin = id_instance.id
         tagging_instance.tip = influences_instance.id
         tagging_instance.author = @importer;
         tagging_instance.creator = @importer;
         tagging_instance.save
         
         # SOA project assignment
         tag_or_create(tagging_instance,"Project","IBM adWiki SOA sample")
       end      
      end
      f.close
    end
    

    
    def self.load_topic_groups( path )
    lines = []
      
     f = File.open(path+"ad_topics.txt")
     
     f.each_line do |line|
       split_line = line.split(":::")
        
       #puts split_line.size
       #line should have 9 columns
       if split_line.size != 9
         puts "Topics: Wrong number of separators: "+split_line.size+ "/9"
         next
       end
       
       ## put the line on the list for use in next loop
       
       ## there we have them all on the list.
       lines << split_line
       
       topicGroup_instance = DynamicType.find_by_name("TopicGroup").new_instance(split_line[0], @importer)
       topicGroup_instance.save

       # SOA project assignment
       tag_or_create(topicGroup_instance,"Project","IBM adWiki SOA sample")
             
       ## add an IBM-ID to it. 
       id_instance = DynamicType.find_by_name("IBM-ID").new_instance(split_line[4],@importer)
       id_instance.save

       # SOA project assignment
       tag_or_create(id_instance,"Project","IBM adWiki SOA sample")
       
       #TODO: that's nasty
       tagging_instance = Tagging.new
       tagging_instance.type = "Tagging"
       tagging_instance.origin=id_instance.id
       tagging_instance.tip=topicGroup_instance.id
       tagging_instance.author = @importer;
       tagging_instance.creator = @importer;
       tagging_instance.save
       #puts "ti.id: "+tagging_instance.id.to_s
       
       topicGroup_instance["Description"]=split_line[2]
       topicGroup_instance["Reference"]=split_line[3]
       
     end
     
    
    lines.each do |split_line|
     ## if this line is not a root topicGroup then reference it !
       if split_line[5]!=nil
         if split_line[5]=="isroot"
           #puts "found root"  
         else
           #puts "found node with parent: "+split_line[5]
           
           ## looking up the topicGroup_instance
           topicGroup_instance = TreeTag.find :first, :conditions=>{:name=>split_line[0]}
           
           ## first find the matching IBM-ID 
           tag = Tag.find :first, :conditions=>{:type=>"IBM-ID", :name=>split_line[5]}   
           
           ## verify if that is an TopicGroup
           if tag != nil 
             if tag.taggable == nil
               puts "No parent topic group found"
               next
             end
              
             if tag.taggable.attributes["type"] != "TopicGroup"
               puts "Parent tag found, but it is not a topicGroup !"
               puts "==========> "+ tag.taggable.attributes["type"].to_s
               next
             end
             
             ## just a little debug
             #puts "found parent node of: "+tag.name+" tag type: "+tag.type
             #puts " tag's taggable("+tag.taggable.id.to_s+") type: "+tag.taggable.type
             
             ## fill it up and save
             relation_instance = DynamicType.find_by_name("ChildOf").new_instance(nil,@importer)
             relation_instance.origin = tag.taggable.id
             relation_instance.tip = topicGroup_instance.id
             relation_instance.save

             # SOA project assignment
             tag_or_create(relation_instance,"Project","IBM adWiki SOA sample")
           end
         end
       end
     end
     #f.close
   return nil
   end
   
   
   # creates tag if needed and tags given taggable
   
    def self.tag_or_create( taggable, dynamic_type, name )
       
       tag = Tag.find :first, :conditions=>{:type=>dynamic_type, :name=>name}
          if tag == nil
            # phase not found.
            tag = DynamicType.find_by_name(dynamic_type).new_instance(name, @importer)
            tag.save
            puts dynamic_type+": "+name+" NOT found ! - created with id: "+tag.id.to_s
          end
          
          # phase found             
          tagging_instance = DynamicType.find_by_name("Tagging").new_instance(nil,@importer)
          tagging_instance.origin = tag.id
          tagging_instance.tip = taggable.id
          tagging_instance.save
          
          ## little debug
          #puts "Phase: "+split_line[5]+" found. ("+tagging_instance.id.to_s+")"
    end
    
    # TODO: import rest of the fields
    def self.load_decisions( path )   
      f = File.open(path+"ad_decisions.txt")
      
      # i needed to specify the line separator because files are apparently dos-encoded
      f.each_line("\r") do |line|
        
        # split it with the triple semicolon separator
        split_line = line.split(":::")
        
        # if number of fields in line read doesn't match the pattern, then we're .... wrong.
        if split_line.size != 24
          puts "Decisions: Wrong number of separators: "+split_line.size.to_s+ "/24"
          next
        end
        #puts "accepted - filling up"
        
        # make new instance and fill the basics
        issue_instance = Taggable.new
        issue_instance.type = "Issue"
        issue_instance.name = split_line[0]
        issue_instance.author = @importer;
        issue_instance.creator = @importer;
        issue_instance.save
        
        
        # scope
        if split_line[5]!= ""
           tag_or_create(issue_instance, "Scope",split_line[5])
        end
        
        # phase
        if split_line[6]!= ""
           tag_or_create(issue_instance, "Phase",split_line[6])
       end
        
        # SubjectArea
        if split_line[7]!=""
           tag_or_create(issue_instance, "SubjectArea",split_line[7])
        end

        if split_line[8]!=""
           tag_or_create(issue_instance, "Role",split_line[8])
        end
        
        # SOA project assignment
        tag_or_create(issue_instance,"Project","IBM adWiki SOA sample")

        issue_instance["ShortName"]=split_line[4]
        issue_instance["Description"]=split_line[9]
        issue_instance["Background"]=split_line[10]
        issue_instance["Drivers"]=split_line[11]
        issue_instance["Recommendation"]=split_line[12]
        issue_instance["Status"]=split_line[16]
        
        # 22 - IBM identifier
        if split_line[22]!=""
          
            # find the dynamicType for IBM-ID, bail out if it fails
            dt = DynamicType.find_by_name "IBM-ID"
            # TODO: maybe it doesn't exist it should be created ?
            if dt == nil
              puts "No IBM-ID tag defined !"
              next
            end
           
            # builds up a new tag and sets name of the tag to the identifier
            #TODO: reason if that's OK to store this single name there or it should be done through the attribute
            tag_instance = dt.new_instance split_line[22]
            tag_instance.save
            tag_instance.make_tagging( issue_instance )
        end  
        
        # 23 - TopicGroup tagging
        if split_line[23] != ""
           
           ## there is a trailing character in this line
          split_line[23]=split_line[23].chop
           
           ## find IBM-ID of the referenced topic-group
           tag = Tag.find :first, :conditions=>{:type=>"IBM-ID", :name=>split_line[23]}
           
           if tag == nil || tag.taggable == nil
             puts "no topic group with IBM-ID: "+split_line[23]+" found."
             next         
           else
             topicGroup_instance = tag.taggable
             
             tagging_instance = DynamicType.find_by_name("Tagging").new_instance(nil,@importer)
             tagging_instance.origin = topicGroup_instance.id
             tagging_instance.tip = issue_instance.id
             tagging_instance.save
           end
                    
        end
        issue_instance.save
      end
      f.close
  end
  
  def self.load_alternatives( path )
      f = File.open(path+"ad_alternatives.txt")
      
      # i needed to specify the line separator because files are apparently dos-encoded
      f.each_line("\r") do |line|
        
        # split it with the triple semicolon separator
        split_line = line.split(":::")
        
        # if number of fields in line read doesn't match the pattern, then we're .... wrong.
        if split_line.size != 12
          puts "Alternatives: Wrong number of separators: "+split_line.size.to_s+ "/12" 
          next
        end
        #puts "accepted - filling up"
        
        alternative_instance = DynamicType.find_by_name("Alternative").new_instance(split_line[2],@importer)        
        alternative_instance.save
        
        # 6th field - description
        
        alternative_instance["Description"]=split_line[5]
        alternative_instance["KnownUses"]=split_line[6]
        alternative_instance["Background"]=split_line[7]
        
        # pros
        if split_line[3]!=nil && split_line[3] !=""
          pro_instance = DynamicType.find_by_name("Pro").new_instance(split_line[3], @importer)
          pro_instance.save
          
          tagging = Tagging.new
          tagging.type = "Tagging"
          tagging.origin = pro_instance.id
          tagging.tip = alternative_instance.id
          tagging.author = @importer;
          tagging.creator = @importer;
          tagging.save
          #puts "Tagging: "+tagging.id.to_s
        end
        
        if split_line[4]!=nil && split_line[4] !=""
          pro_instance = DynamicType.find_by_name("Con").new_instance(split_line[4],@importer)
          pro_instance.save
          
          tagging = Tagging.new
          tagging.type = "Tagging"
          tagging.origin = pro_instance.id
          tagging.tip = alternative_instance.id
          tagging.author = @importer;
          tagging.creator = @importer;
          tagging.save
          #puts "Tagging: "+tagging.id.to_s      
        end
        
        if split_line[8] != ""
           #puts "Alternative referencing Issue id: "+split_line[8]
          
           tag = Tag.find :first, :conditions=>{:type=>"IBM-ID", :name=>split_line[8]}   
           
           if tag != nil 
              
             solvedBy_relation = DynamicType.find_by_name("SolvedBy").new_instance(nil,@importer)
             
             ## there we can safely assume that there is going to be only single tag.taggable
             
             ## for some unknow reason this doesn't assign ActiveRecord mapped fields (origin, tip) of the SolvedBy
             #solvedBy_relation.relate( alternative_instance, tag.taggable )
             
             solvedBy_relation.origin=alternative_instance.id
             solvedBy_relation.tip=tag.taggable.id
             solvedBy_relation.save
           else
             puts "referenced issue not found !" 
           end
           
        end

        alternative_instance.save

        # SOA project assignment
        tag_or_create(alternative_instance,"Project","IBM adWiki SOA sample")
        
     end
  end
end
