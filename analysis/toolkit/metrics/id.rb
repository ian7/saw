require_relative 'metric.rb'

class IDMetric < Metric
	def self.name
		return "ID"
	end
	def self.header
		fields = [
			"Project",
			"ID",
			"Destroyed"
		]

		return fields.join "\t"
	end
	def self.suitableItems
		return [ IssueLogItem, AlternativeLogItem ]
	end
	def self.priority
		return 10
	end
	def self.calculate( logItem )
		values = []
		values << logItem.projectID.to_s
		values << logItem.id.to_s
		values << logItem.events.select{ |x| x.class == DestructionEvent }.size.to_s

		return values.join "\t"
	end
end