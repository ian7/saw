class Metric
	def self.name
		return "Metric"
	end
	def self.header
		return "Header"
	end
	def self.priority
		return 0
	end
	def self.suitableItems
		return [ ]
	end
	def self.findMetricsFor( logItemClass )
		Metric.subclasses
			.sort {|x,y| y.priority <=> x.priority }
			.select{ |metric| metric.suitableItems.find {|x| x == logItemClass }}
	end
end