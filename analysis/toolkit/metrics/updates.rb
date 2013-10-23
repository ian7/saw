require_relative 'metric.rb'

class UpdatesMetric < Metric
	def self.name
		return "Updates"
	end
	def self.header
		return "Updates"
	end
	def self.suitableItems
		return [ IssueLogItem, AlternativeLogItem ]
	end
	def self.calculate( logItem )
		updateEvents = logItem.events.select{ |x| x.class == UpdateEvent }
		return updateEvents.size.to_i.to_s 
	end
end