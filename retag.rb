puts Taggable.find( :all, :conditions=>{:type=>"Issue"}).count.to_s + " Issues"
Taggable.find( :all, :conditions=>{:type=>"Issue"}).each do |i|
	i.taggings_to.all.each do |t|
		if t.tag.type = "Project"
			t.delete
		end
	end
end

puts Project.all.count.to_s + " Projects"
Taggable.find( :all, :conditions=>{:type=>"Issue"}).each do |i|
	Project.all.each do |p|
		t = Tagging.new 
		t.type="Tagging"
		t.origin = p.id
		t.tip = i.id
		t.save
	end
end

