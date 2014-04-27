require_relative 'metric.rb'

class IDMetric < Metric
	def self.name
		return "ID"
	end
	def self.header
		fields = [
			"Project",
			"ID",
			"Destroyed",
			"Lifespan",
			"LastChange"
		]

		return fields
	end
	def self.suitableItems
		return [ IssueLogItem, AlternativeLogItem ]
	end
	def self.priority
		return 10
	end
	def self.calculate( logItem, extraFilter=nil )
		values = []
		# project
		values << logItem.projectID.to_s
		# id - with a hack to make EP ids unique
		if logItem.id.size < 5
			values << logItem.projectID.to_s + "-" + logItem.id.to_s
		else
			values << logItem.id.to_s
		end
		# destroyed
		values << logItem.events.select{ |x| x.class == DestructionEvent }.size.to_s
		allSortedEvents = logItem.allEvents.sort {|x,y| x.time.to_i <=> y.time.to_i }
		itemSortedEvents = logItem.events.sort {|x,y| x.time.to_i <=> y.time.to_i }
		# lifespan
		values << (allSortedEvents.last.time.to_i - itemSortedEvents.first.time.to_i).to_s
		# last event
		values << (allSortedEvents.last.time.to_i - itemSortedEvents.last.time.to_i).to_s
		
		return values
	end
end