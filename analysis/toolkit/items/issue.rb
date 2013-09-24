require_relative './logItem.rb'

class IssueLogItem < LogItem
	def initialize( paramId = nil, paramEvents = nil )
		super paramId, paramEvents
	end
	def analyze
		self.creation
	end
	def creation
		e = @filteredEvents.find { |x| x.controller == 'create' && x.distance == '0' && x.itemType == 'Issue'}
		if( e )
			return CreationEvent.new( e )
		else
			puts 'no creation'
		end
	end
	def update
	end
end
