require_relative 'metric.rb'

class DecisionsMetric < Metric
	def self.name
		return "Decisions"
	end
	def self.header
		fields = [
			"Position Count",
			"Compacted Position Count",
			"Positive",
			"PositiveRevoked",
			"Negative",
			"NegativeRevoked",
			"Open",
			"OpenRevoked",
			"Final State",
			"Final Decision",
			"Deciders",
			"Time In NoPositions",
			"Time In Aligned",
			"Time In Colliding",
			"Time In Sealed",
			"Consensus State Changes"
		]

		return fields.join "\t"
	end
	def self.suitableItems
		return [ AlternativeLogItem ]
	end
	def self.calculate( logItem )
		state = []
		
		decisionEvents = logItem.events.sort{ |x,y| x.time.to_i <=> y.time.to_i }.select{ |x| x.class == DecisionEvent && x.decision != "(no)"}
		
		state << decisionEvents.select{ |x| x.decision != "" && x.decision != "(no)" }.size.to_i.to_s 
		
		compactedDecisionEvents = DecisionEvent.anihilate( decisionEvents ) 

		state << compactedDecisionEvents.select{ |x| x.decision != "" && x.decision != "(no)" }.size.to_i.to_s 
		state << compactedDecisionEvents.select{ |x| x.decision == "Positive"}.size.to_s 
		state << decisionEvents.select{|x| x.decision == "AntiPositive"}.size.to_s
		state << compactedDecisionEvents.select{ |x| x.decision == "Negative"}.size.to_s 
		state << decisionEvents.select{|x| x.decision == "AntiNegative"}.size.to_s
		state << compactedDecisionEvents.select{ |x| x.decision == "Open"}.size.to_s 
		state << decisionEvents.select{|x| x.decision == "AntiOpen"}.size.to_s

		# let's find last decision
		if compactedDecisionEvents.size > 0
			state << decisionEvents.last.state 
			if decisionEvents.last.state == "aligned"
				state << compactedDecisionEvents.last.decision
			else
				state << "n/a"
			end
		else
			state << "n/a"
			state << "n/a"
		end

		#  deciders
		state << decisionEvents.uniq{ |x| x.user }.size.to_s  

		# time in no positions
		state << self.integrateTimeInAllignment( logItem, "no positions" ).to_s

		# time in alligned
		state << self.integrateTimeInAllignment( logItem, "aligned" ).to_s

		# time in colliding
		state << self.integrateTimeInAllignment( logItem, "colliding" ).to_s

		# time in no positions
		state << self.integrateTimeInAllignment( logItem, "sealed" ).to_s

		# state transitions
		transitionsCounter = 0
		lastDecisionState = ""

		decisionEvents.each do |decisionEvent|
			if decisionEvent.state != lastDecisionState
				lastDecisionState = decisionEvent.state
				transitionsCounter += 1
			end
		end

		state << transitionsCounter.to_s


		return state.join "\t"
	end
	def self.integrateTimeInAllignment( logItem, state )
		
		decisionEvents = logItem.events.select { |x| x.class == DecisionEvent }.sort {|x,y| x.time.to_i <=> y.time.to_i }

		starts = decisionEvents.select { |x| x.state == state }

		if starts.size == 0
			return "0"
		end

		integratedTime = 0

		starts.each do |start|
			#let's find the end
			
			#nextOne = decisionEvents.find {|x| x.state != state && x.time.to_i >= start.time.to_i }			
			nextOne = decisionEvents.find {|x| x.time.to_i > start.time.to_i }

			if logItem.id == '6'
			#	debugger
			end
			
			# in case there was no finish for it. 
			if not nextOne
				# this is counting till the last event of the item
				#nextOne = logItem.events.sort {|x,y| x.time.to_i <=> y.time.to_i }.last
				# instead of that maybe we should count until the the end of the exercise
				nextOne = logItem.allEvents.sort {|x,y| x.time.to_i <=> y.time.to_i }.last
			end
			integratedTime = integratedTime + (nextOne.time.to_i - start.time.to_i)
		end
		return integratedTime
	end
end