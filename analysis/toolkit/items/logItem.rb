class LogItem 
	@allEvents = []
	@output = nil

	def initialize( paramId = nil, paramEvents = nil )
		@events = []
#debugger
		if paramEvents
#			puts 'rememberging paramEvents'
			@allEvents = paramEvents
		else
			@allEvents = []
		end

		if paramId
			self.id = paramId
		end

		if paramEvents 
			self.parse
		end
	end
	def events
		return @events
	end
	def allEvents
		return @allEvents
	end

	def getFilteredEvents
		return @filteredEvents
	end

	def id
		return @id
	end

	def id=(value)
		@id = value

		if Taggable.exists? :conditions=>{:id=>@id}
			@taggable = Taggable.find @id
			type = @taggable['type']
			#puts 'type found'
		else
	#		debugger
			@taggable = nil
			# if it was deleted - then let's figure what was its type
			ce = @allEvents.find { |x| x.to_id == @id && x.distance == '0'}
			if ce
				type = ce.itemType.to_s + '-deleted'
			#	puts 'found type: ' + ce.itemType.to_s
			else
				puts 'no type found - id: ' + value
			end
		end
		
		outputFileName = './analysis/output/item-' + type + '-' + id.to_s
		#puts "output file name: " + outputFileName

		@output = File.open  outputFileName + '.item', 'w'
		#@outputFull = File.open outputFileName + '.full', 'w'
		#@output.puts 'ip, timestamp, user, latency, rendering, verb, controller, action, distance, type, params'
	end

	def parse( digestLog = nil )
		if digestLog
			@allEvents = digestLog
			puts 'changing digestlog'
		end

		@filteredEvents = @allEvents.select { |line| line[9] == @id || line[8] == @id }

		#@filteredEvents.each do |eventLine|
		#	@outputFull.puts eventLine.join(",\t").to_s
		#end
		#puts 'found ' + filteredEvents.size.to_s + ' events'
	end

#	def to_s
#		return @taggable.attributes.join("\t").to_s
#	end
	def focus
		focuses = @filteredEvents.select{ |x| x.verb == 'notify' && (x.controller == 'focused' || x.controller == 'blured') }.map { |x| FocusEvent.new x }

		focuses.each do |x|
			if  x.controller == 'blured'
				# let's choose all the focuses of that user
				earlierFocuses = focuses.select{ |y| y.controller == 'focused' && y.time.to_i < x.time.to_i && y.user == x.user }
				# and then find the last one. 
				match = earlierFocuses.last
				#debugger
				if match
					x.focusTimestamp = match.time
				else
					#puts 'no focus match for blur event'
				end
			end
		end
		return focuses
	end
	def update
		updates = @filteredEvents.select { |x| x.verb == 'PUT' && x.action == 'update' } .map { |x| UpdateEvent.new(x) } 
	end
end
