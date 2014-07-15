require_relative 'metric.rb'

class UpdatesMetric < Metric
	def self.name
		return "Updates"
	end
	def self.header
		fields = [
			"Update count",
			"Last update",
			"Activity Time",
			"Contributors",
			"Deciders2",
			"Time since last decision"
		]

		return fields
	end
	def self.suitableItems
		return [ IssueLogItem, AlternativeLogItem ]
	end
	def self.calculate( logItem, extraFilter=nil )
		state = []

		updateEvents = logItem.events.select{ |x| x.class == UpdateEvent }.sort_by { |x| x.time.to_i }
		# total update count
		state << updateEvents.size.to_s		

		# last update
		if updateEvents.size > 0
			state << updateEvents.last.time.to_i
		else
			ce = logItem.events.find {|x| x.class == CreationEvent }
			if ce
				state << ce.time.to_i
			else
				state << logItem.events.last.time.to_i
			end
		end

		le = logItem.events.sort_by {|x| x.time.to_i }
		#debugger
		state << (le.last.time.to_i - le.first.time.to_i).to_s

		# contributors
		state << logItem.events.uniq{ |x| x.user }.size.to_s  

		de = logItem.events.select{ |x| x.class == DecisionEvent && x.decision != "(no)" && x.decision != "" }.sort_by { |x| x.time.to_i }

		# number of deciders
		state << de.uniq{ |x| x.user }.size.to_s 
		ae = logItem.allEvents.sort_by{|x| x.time.to_i}
		
		if de.size > 0
			state << ae.last.time.to_i - de.last.time.to_i 
		else
			state << "-1"
		end
		
		return state
	end
end