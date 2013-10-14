require_relative 'logEvent.rb'

class FocusEvent < LogEvent

	def self.find( id, events, treshold = 0 )		
		focuses = events.select{ |x| x.verb == 'notify' && x.to_id == id && (x.controller == 'focused' || x.controller == 'blured') }.map { |x| FocusEvent.new x }
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

	def initialize( param )
		@focusTimestamp = nil
		super( param )
	end
	def to_s( item = nil )
		if self.controller == 'blured'
			return self.time + "\t" + self.controller + "\t" + self.user + "\t" + (self.time.to_i - @focusTimestamp.to_i).to_s
		else
			return self.time + "\t" + self.controller + "\t" + self.user + "\t" 
		end			
	end
	def focusTimestamp
		return @focusTimestamp
	end
	def focusTimestamp=(value)
		@focusTimestamp = value
	end

end
