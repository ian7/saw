require './analysis/toolkit.rb'


outputProjects = File.open 'output/projects.csv'
outputIssues = File.open 'output/issues.csv'
outputAlternaitves = File.open 'output/alternatives.csv'
outputDecisions = File.open 'output/decisions.csv'

decisionTags = Taggable.find :all, :conditions=>{:type=>"Decision"}

# get predefined decisions

	# puts "Count: " + decisions.count.to_s
	# puts decisions.last
	# puts decisions.first


allIssues = Taggable.find :all, :conditions=>{:type=>"Issue"}
allProjects = Taggable.find :all, :conditions=>{:type=>"Project"}


allProjects.each do |project|
	issues = project.related_from().select{ |x| x["type"]=="Issue"}
	#puts "Project ID: " + project.id.to_s + 
	outputProject.print "\"" + project["name"] + "\"\t" 
	outputProject.print issues.count.to_s + "\t" 

	alternativeCount =0 
	decisionCounts=[]

	issues.each do |issue|
		alternatives = issue.related_to "SolvedBy"
		alternativeCount += alternatives.count
	
		alternatives.each do |alternative|
			sb = alternative.relations_from("SolvedBy").first
			sb.relations_to.each do |decisionTagging|
				#puts decisionTagging.id
				#puts decisionTagging.origin
				decisionIndex = decisionTags.to_a.index{ |x| x.id == decisionTagging.origin }
				if decisionIndex then
					decision = decisionTags[decisionIndex]

					if decisionCounts[decisionIndex] then
						decisionCounts[decisionIndex] = decisionCounts[decisionIndex] + 1 
					
					else
						decisionCounts[decisionIndex] = 1
					end
				end
			end
			#decisionTags = alternative.related_to().select{ |x| x["type"]=="Decision"}
		end


	end
	outputProject.print alternativeCount.to_s + "\t"
	(0..3).each do |decisionIndex|
		outputProject.print decisionCounts[decisionIndex].to_s + "\t"
	end
	puts ""
end



def is_colliding( sb )

	firstDecision = nil

	sb.relations_to.each do |decisionTagging|

		decisionIndex = decisionTags.to_a.index{ |x| x.id == decisionTagging.origin }
		if decisionIndex then
			decision = decisionTags[decisionIndex]


			if not firstDecision 
				firstDecision = decision
			else
				if firstDecision != decision
					return false
				end
			end
		end
	end	
	return true
end



def get_decision( sb )

	totalDecisionCount = 0

	sb.relations_to.each do |decisionTagging|

		decisionIndex = decisionTags.to_a.index{ |x| x.id == decisionTagging.origin }
		if decisionIndex then
			decision = decisionTags[decisionIndex]

			if decisionCounts[decisionIndex] then
				decisionCounts[decisionIndex] = decisionCounts[decisionIndex] + 1 
			
			else
				decisionCounts[decisionIndex] = 1
			end

			totalDecisionCount = totalDecisionCount + 1
		end

	end	

	# if all positons are refering to the single decision, then it is decided
	(0..decisionTags.size).each do |decisionIndex|
		if decisionCounts[decisionIndex] == totalDecisionCount
			return decisionTags[decisionIndex]
		end
	end	

	return false
end



def decision_state( sb )
	sb.relations_to.each do |decisionTagging|

		decisionIndex = decisionTags.to_a.index{ |x| x.id == decisionTagging.origin }
		if decisionIndex then
			decision = decisionTags[decisionIndex]

			if decisionCounts[decisionIndex] then
				decisionCounts[decisionIndex] = decisionCounts[decisionIndex] + 1 
			
			else
				decisionCounts[decisionIndex] = 1
			end
		end
	end	
end






=begin
allIssues.each do |issue|
	alternatives = issue.related_to "SolvedBy"
	puts "Issue ID: " + issue.id.to_s
end
=end


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