require_relative './logItem.rb'

class SolvedByLogItem < LogItem
	def initialize( paramId = nil, paramEvents = nil )
		super paramId, paramEvents
	end

	def status( output )
		s = []

		return s
	end

	def analyze( output )
		@output.puts creation.to_s
		decisions.each do |eventLine|
			@output.print eventLine.to_s + "\t"
			@output.print (eventLine.time.to_i-creation.time.to_i ).to_s + "\t"
			@output.puts  integrateState( eventLine.time )
		end
		updates.each do |x| 
			@output.puts x.to_s 
		end
		focus.each do |x|
			@output.print x.to_s + "\t"
			@output.print "\n"
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

	def updates
		#debugger
		return @filteredEvents.select{ |x| x.verb == 'PUT' && x.controller == 'RController' && x.action == 'update' }.map { |x| UpdateEvent.new x }
	end
	def delete
		ce = @filteredEvents.find { |x| x.controller == 'relate' && x.distance == '0' && x.itemType == 'SolvedBy'}
		de = @filteredEvents.find { |x| x.controller == 'RController' && x.verb == 'DELETE' && x.action =='destroy'}

		if ce && de
		else
			puts 'failed to find destruction event'
		end
	end
end
