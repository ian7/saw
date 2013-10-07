require_relative 'logEvent.rb'

class CreationEvent < LogEvent
	
	def self.find( id, events, treshold = 0 )
		e = events.find { |x| x.controller == 'create' && x.distance == '0' && x.to_id == id }

		if( e )
			return [CreationEvent.new( e )]
		else
			#puts 'no creation'
			return []
		end
	end

	def to_s( item = nil )
		return self.time + "\t" + 'creation' + "\t" + self.user + "\n"
	end
end
