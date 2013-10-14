require_relative 'logEvent.rb'

class StateEvent < LogEvent
	def self.find( id, events, treshold = 0 )	
	end

	def initialize( event, state )
		super( event )
		if( state )
			@state = state
		else
			@state = "(none)"
		end
	end

	def to_s( item = nil )
			return self.time + "\t" + "state" +  "\t" + @state 
	end
end
