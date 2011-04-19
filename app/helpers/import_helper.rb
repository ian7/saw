module ImportHelper
  def import( filename )
    
    
    importer = User.find :first, :conditions=>{:email=>"importer@sonyx.net"}
    
    f = File.new( filename,'r')
    s = f.read
    
    puts 'loading: ' + filename
    content = JSON.parse s
    
    puts 'loaded: ' + content.size.to_s + ' taggables'
    content.each do |taggable|
#      case taggable.type
#      else
#        # right now. just import them all..
        puts  ' adding id: ' + taggable['_id'] + 'dynamic type: '+taggable['_type'];
    
    
        # let's skip tags that exist with other ids
        
        if taggable['_type'] == "Tag"
          if Taggable.find :first, :conditions=>{:name=>taggable['name'], :type=>taggable['type']}
            next
          end
        end
    
        dt = DynamicType.find_by_name( taggable['_type'])
        
        
        
        if dt!=nil 

           t = dt.new_instance( nil , importer)
           t['_id'] = taggable['_id']
           t.save
           t['type'] = taggable['type']

          taggable.each do |attribute|
            if attribute == '_type'
              next
            end

            t.write_attribute(attribute,taggable[attribute])
          end

        end
        
        if dt==nil && taggable['_type'] == 'Taggable'
          puts ' missing dynamic type: '+taggable['_type'];
          # it doesn't make sense to continue
            t = Taggable.new( taggable )
        end
        
        if taggable['origin']
          puts "got origin: " + taggable['origin']
          t.origin = BSON::ObjectId(taggable['origin'])
        end
        if taggable['tip']
          puts "got tip: " + taggable['tip']
          t.tip = BSON::ObjectId(taggable['tip'])
        end

        t.save
        
#      end
    end
    return true
  end
end