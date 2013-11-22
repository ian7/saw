require_relative './logItem.rb'

class SolvedByLogItem < LogItem
	def initialize( paramId = nil, paramEvents = nil )
		super paramId, paramEvents
	end

	def status( output )
		s = []

		return s
	end

	def analyze

		@events.concat( CreationEvent.find( self.id, @allEvents ));
		@events.concat( UpdateEvent.find( self.id, @allEvents ));
		@events.concat( FocusEvent.find( self.id, @allEvents ));
		@events.concat( DecisionEvent.find( self.id, @allEvents));
		@events.concat( DestructionEvent.find( self.id, @allEvents));

		@sortedEvents = @events.sort {|x,y| x.time.to_i <=> y.time.to_i }

		return @sortedEvents
	end

	def to_s
		@sortedEvents.each do |x|
			@output.puts x.to_s( self ) 
		end
	end
	def integrateState( timeTreshold )
		ds = decisions( timeTreshold ).select{ |x| x.decision != "(no)" }

		if( ds.length == 0 )
			return 'no positions'
		end
		if( ds.length == 1 )
			return 'decided'	
		end

		firstD = ds[0]
		
		ds.each do |d|
			if d.decision != firstD.decision
				return 'colliding'
			end
		end

		return 'aligned'
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

	def updates
		#debugger
		return @filteredEvents.select{ |x| x.verb == 'PUT' && x.controller == 'RController' && x.action == 'update' }.map { |x| UpdateEvent.new x }
	end

end
