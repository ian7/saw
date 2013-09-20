


# this actually wrapes single line of digest and gives names to the fields
# mind, that if digest changes this is going to change too
class LogEvent < Array
	def id
		return self[8]
	end
	def ip
		return self[0]
	end
	def time
		return self[1]
	end
	def user
		return self[2]
	end
	def verb
		return self[5]
	end
	def controller 
		return self[6]
	end
	def action
		return self[7]
	end
	def item_id
		return self[8]
	end
	def to_id
		return self[9]
	end
	def distance
		return self[10]
	end
	def itemType
		return self[11]
	end
	def taggingTip
		return self[11]
	end
end

class CreationEvent < LogEvent
	def to_s
		return self.time + "\t" + 'creation' + "\t" + self.user + "\n"
	end
end

class DecisionEvent < LogEvent
	def initialize( param )
		super( param )
		@decision = Taggable.find self.taggingTip
	end
	def decision 
		return @decision
	end
	def to_s
		return self.time + "\t" + 'decision' + "\t" + @decision['name'] + "\t" + self.user 
	end
end

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
		#@output.puts 'ip, timestamp, user, latency, rendering, verb, controller, action, distance, type, params'
	end

	def parse( digestLog = nil )
		if digestLog
			@allEvents = digestLog
		end

		@filteredEvents = @allEvents.select { |line| line[9] == @id || line[8] == @id }

		@filteredEvents.each do |eventLine|
			#@output.puts eventLine.join(",\t").to_s
		end
		#puts 'found ' + filteredEvents.size.to_s + ' events'
	end

	def to_s
		return self.join("\t").to_s
	end
end


class IssueLogItem < LogItem
	def initialize( paramId = nil, paramEvents = nil )
		super paramId, paramEvents
	end
end

class AlternativeLogItem < LogItem
	def initialize( paramId = nil, paramEvents = nil )
		super paramId, paramEvents
	end
end

class SolvedByLogItem < LogItem
	def initialize( paramId = nil, paramEvents = nil )
		super paramId, paramEvents
	end

	def analyze( output )
		@output.puts creation.to_s
		decisions.each do |eventLine|
			@output.print eventLine.to_s
			@output.puts "\t" + integrateState( eventLine.time )
		end
	end

	def integrateState( timeTreshold )
		ds = decisions( timeTreshold )

		if( ds.length == 0 )
			return 'no positions'
		end
		if( ds.length == 1 )
			return 'decided'	
		end

		firstD = ds[0]
		
		ds.each do |d|
			if d.decision != firstD.decision
				return 'conflicting'
			end
		end

		return 'alligned'

	end

	def creation
		e = @filteredEvents.find { |x| x.controller == 'relate' && x.distance == '0' && x.itemType == 'SolvedBy'}
		if( e )
			return CreationEvent.new( e )
		else
			puts 'no creation'
		end
	end
	def decisions( timeTreshold = nil )

		if( timeTreshold )
			events = @filteredEvents.select { |x| x.time <= timeTreshold }
		else
			events = @filteredEvents
		end

		ds = []
		evs = events.select{ |x| x.controller == 'TagController' && x.action == 'dotag' }
		
		evs.each do |event|
			ds << DecisionEvent.new( event )
		end

		return ds 
	end
end

