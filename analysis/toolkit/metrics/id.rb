require_relative 'metric.rb'

class IDMetric < Metric
	def self.name
		return "ID"
	end
	def self.header
		return "Project\t ID"
	end
	def self.suitableItems
		return [ IssueLogItem, AlternativeLogItem ]
	end
	def self.priority
		return 10
	end
	def self.calculate( logItem )
		return "#{logItem.projectID}\t#{logItem.id}"
	end
end