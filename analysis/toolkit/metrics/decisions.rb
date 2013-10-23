require_relative 'metric.rb'

class DecisionsMetric < Metric
	def self.name
		return "Decisions"
	end
	def self.header
		return "Decisions\tPositive\tNegative\tOpen\tFinalState\tFinalDecision\tDeciders"
	end
	def self.suitableItems
		return [ AlternativeLogItem ]
	end
	def self.calculate( logItem )
		state = ""
		
		decisionEvents = logItem.events.select{ |x| x.class == DecisionEvent }

		state << decisionEvents.size.to_i.to_s + "\t"
		state << decisionEvents.select{ |x| x.decision == "Positive"}.size.to_s + "\t"
		state << decisionEvents.select{ |x| x.decision == "Negative"}.size.to_s + "\t"
		state << decisionEvents.select{ |x| x.decision == "Open"}.size.to_s << "\t"

		# let's find last decision
		if decisionEvents.size > 0
			state << decisionEvents.last.state + "\t"
			if decisionEvents.last.state == "alligned"
				state << decisionEvents.last.decision + "\t"
			else
				state << "n/a\t"
			end
		else
			state << "n/a\t"
			state << "n/a\t"
		end

		state << decisionEvents.uniq{ |x| x.user }.size.to_s  
		return state
	end
end