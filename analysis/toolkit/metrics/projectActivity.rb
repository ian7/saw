require_relative 'metric.rb'

class ProjectActivityMetric < Metric
	def self.name
		return "ProjectActivity"
	end
	def self.header
		fields = [
			"ProjectID",
			"Issues Created",
			"Issues Edited",
			"Alternatives Created",
			"Alternatives Edited",
			"Positive Decisions Created",
			"Negative Decisions Created",
			"Open Decisions Created",
			"Decisions Revoked",
		]
		return fields

	end
	def self.suitableItems
		return [ ProjectLogItem ]
	end

	def self.calculate( projectItem, extraFilter=nil)
		state = []

		if extraFilter == nil
			extraFilter = Proc.new{ true }
		else
			#debugger
		end

		state << projectItem.projectID
		# issuesCreated
		state << projectItem.issues.select{ |issue| issue.events.find{ |e| e.class == CreationEvent && extraFilter.call(e) }}.size

		# issuesEdited
		state << projectItem.issues.select{ |issue| issue.events.find{ |e| e.class == UpdateEvent && extraFilter.call(e)}}.size
		
		# alternativesCreated	
		state << projectItem.allAlternatives.select{ |alternative| alternative.events.find{ |e| e.class == CreationEvent && extraFilter.call(e)}}.size

		# issuesEdited
		state << projectItem.allAlternatives.select{ |alternative| alternative.events.find{ |e| e.class == UpdateEvent && extraFilter.call(e)}}.size

		# positive
		state << projectItem.allAlternatives.select{ |alternative| alternative.events.find{ |e| e.class == DecisionEvent && e.decision == "Positive" && extraFilter.call(e)}}.size

		# negative
		state << projectItem.allAlternatives.select{ |alternative| alternative.events.find{ |e| e.class == DecisionEvent && e.decision == "Negative" && extraFilter.call(e)}}.size

		# open
		state << projectItem.allAlternatives.select{ |alternative| alternative.events.find{ |e| e.class == DecisionEvent && e.decision == "Open" && extraFilter.call(e)}}.size

		# anti
		state << projectItem.allAlternatives.select{ |alternative| alternative.events.find{ |e| e.class == DecisionEvent && e.decision.match('Anti') && extraFilter.call(e)}}.size

		#state << user
		
		return state
	end
end