class Tag < Taggable
    
    include TaggablesHelper
    
    def make_tagging( taggable )
      tagging = Tagging.new
      tagging.type="Tagging"
      tagging.origin = id
      tagging.tip = taggable.id
      tagging.save
    end
    
    #def taggings
    #  Taggable.find :all, :conditions=>{:type=>"Tagging", :origin=>id}
    #end
    
    #def tagging
    #  Taggable.find :first, :conditions=>{:type=>"Tagging", :origin=>id}
    #end
    
    # mind that it returns array
    def taggables
      retval = []
      taggings_from.each do |tagging|
        t = Taggable.find_by_id tagging.tip
        if t != nil
          retval << t
        end
      end
      return retval 
    end
    
    # mind the difference to plural form
    def taggable
      return taggables[0]
    end
  
    def controller
      return "Tag"
    end
end

#class Project < Tag
#end