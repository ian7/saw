

def is_colliding( sb , project )
	decisionTags = Taggable.find :all, :conditions=>{:type=>"Decision"}

	firstDecision = nil

	sb.relations_to.each do |decisionTagging|

		decisionIndex = decisionTags.to_a.index{ |x| x.id == decisionTagging.origin }
		if decisionIndex then
			decision = decisionTags[decisionIndex]

			if( not decision.is_related_from( project ) )
#				puts 'not tagged for: ' + project['name']
				next
			else
#				puts 'tagged for: ' + project['name']
			end

			if not firstDecision  then
				firstDecision = decision
			else
				if firstDecision != decision then
					return true
				end
			end
		end
	end	
	return false
end


def get_decision( sb , project )
	decisionTags = Taggable.find :all, :conditions=>{:type=>"Decision"}
	decisionCounts = []

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
		if decisionCounts[decisionIndex] == totalDecisionCount then
			return decisionTags[decisionIndex]
		end
	end	

	return false
end
