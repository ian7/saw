require_relative 'metric.rb'

class EditorsMetric < Metric
	def self.name
		return "Editors"
	end
	def self.header
		return ["Editors"]
	end
	def self.suitableItems
		return [ IssueLogItem, AlternativeLogItem ]
	end
	def self.calculate( logItem )
		state = []

		editors = {}
		logItem.events.each{ |x| 
			if editors[x.user] 
				editors[x.user] = editors[x.user] + 1
			else
				editors[x.user] = 1
			end
		}
		state << editors.size
		return state
	end
end