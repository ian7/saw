require_relative 'logEvent.rb'

class DestructionEvent < LogEvent
	def self.find( id, events, treshold = 0 )
		ce = events.find { |x| x.to_id == id && x.controller == 'create' && x.distance == '0' }
		de = events.find { |x| x.to_id == id && x.controller == 'RController' && x.verb == 'DELETE' && x.action =='destroy'}
		if ce && de
			return [DestructionEvent.new(de)]
		else
			#puts 'failed to find destruction event'
			return []
		end
	end

	def to_s( item = nil )
		ce = CreationEvent.find( self.to_id, item.allEvents ).first

		if ce
			return self.time + "\t" + 'destruction' + "\t" + self.user + "\t after " + (self.time.to_i - ce.time.to_i).to_s + " seconds"
		else
			return self.time + "\t" + 'destruction' + "\t" + self.user + "\t after " + "-1" + " seconds"
		end
	end
end
