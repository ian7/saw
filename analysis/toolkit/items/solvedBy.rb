require_relative './logItem.rb'

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
