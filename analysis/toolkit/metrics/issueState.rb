require_relative 'metric.rb'

class IssueStateMetric < Metric
	def self.name
		return "IssueState"
	end
	def self.header
		fields = [
			"AlternativesCount",
			"NoDecisions",
			"Colliding",
			"Alligned",
			"Sealed",
			"FinalChoice",
			"ChoiceStateChanges",
			"TimeInNoAlternatives",
#			"TimeInNoPositions",
#			"TimeInAlligned",
#			"TimeInSealed",
		]

		return fields.join "\t"

	end
	def self.suitableItems
		return [ IssueLogItem ]
	end
	def self.calculate( logItem )
		state = []
			
		state << logItem.alternatives.size.to_s 
		state << logItem.alternatives.select{ |x| x.state == 'no positions'}.size.to_s
		state << logItem.alternatives.select{ |x| x.state == 'colliding'}.size.to_s
		state << logItem.alternatives.select{ |x| x.state == 'alligned'}.size.to_s
		state << logItem.alternatives.select{ |x| x.state == 'sealed'}.size.to_s
		state << IssueStateEvent.integrateState( logItem )

		# this is going to be useful for many purposes
		stateEvents = logItem.events.select{ |x| x.class == IssueStateEvent }

		# let's just count the transitions
		state << stateEvents.size.to_s
		
		# time in no alternatives
		state << self.integrateTimeInState( logItem, "no alternatives" ).to_s

		# time in no positions
		state << self.integrateTimeInState( logItem, "no positions" ).to_s

		# time in incomplete
		state << self.integrateTimeInState( logItem, "incomplete" ).to_s

		# time in complete
		state << self.integrateTimeInState( logItem, "complete" ).to_s

		return state.join "\t"
	end

	def self.integrateTimeInState( logItem, state )
		stateEvents = logItem.events.select { |x| x.class == IssueStateEvent }  

		
		starts = stateEvents.select { |x| x.state == state }

		if starts.size == 0
			return "-"
		end

		integratedTime = 0

		starts.each do |start|
			#let's find the end
			if stateEvents.size == 1
#				debugger
			end
			nextOne = stateEvents.find {|x| x.state != state && x.time.to_i >= start.time.to_i }
			
			# in case there was no finish for it. 
			if not nextOne
				nextOne = logItem.events.sort {|x,y| x.time.to_i <=> y.time.to_i }.last
			end
			integratedTime = integratedTime + (nextOne.time.to_i - start.time.to_i)
		end
		return integratedTime
	end

end