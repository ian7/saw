require './analysis/toolkit.rb'

# get predefined decisions
	decisions=Taggable.find :all, :conditions=>{:type=>"Decision"}
	puts "Count: " + decisions.count.to_s
	#puts decisions.last
	#puts decisions.first


allIssues = Taggable.find :all, :conditions=>{:type=>"Issue"}


allIssues.each do |issue|
	alternatives = issue.related_to "SolvedBy"
	puts "Issue ID: " + issue.id.to_s
end


=begin
	lines = read('digest.log')


	f = frequency(lines,"ips.csv") {|l| 
		if l[8]=="dotag"
			l[12]
		else
			nil
		end
	}

	dump( f, "decisions.csv")

	decisions.each do |d|
		t = resample( lines ) {|l| l[8]=="dotag" && l[12] == d.id.to_s}
		fn = d.name.to_s+".csv"
		dump( t,fn)
		render( fn, d.name.to_s+".pdf" )
	end

=end