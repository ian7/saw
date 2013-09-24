class LogItem 
	@allEvents = []
	@output = nil
		
	def initialize( paramId = nil, paramEvents = nil )
		if paramEvents
			@allEvents = paramEvents
		end


		if paramId
			self.id = paramId
		end

		if paramEvents 
			self.parse
		end
	end

	def id
		return @id
	end

	def id=(value)
		@id = value

		@taggable = Taggable.find id

		@output = File.open './analysis/output/item-' + @taggable['type'] + '-' + id.to_s + '.item', 'w'
		@outputFull = File.open './analysis/output/item-' + @taggable['type'] + '-' + id.to_s + '.full', 'w'
		#@output.puts 'ip, timestamp, user, latency, rendering, verb, controller, action, distance, type, params'
	end

	def parse( digestLog = nil )
		if digestLog
			@allEvents = digestLog
		end

		@filteredEvents = @allEvents.select { |line| line[9] == @id || line[8] == @id }

		@filteredEvents.each do |eventLine|
			@outputFull.puts eventLine.join(",\t").to_s
		end
		#puts 'found ' + filteredEvents.size.to_s + ' events'
	end

	def to_s
		return self.join("\t").to_s
	end
end
