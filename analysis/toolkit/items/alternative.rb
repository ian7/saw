require_relative './logItem.rb'

class AlternativeLogItem < LogItem
	def initialize( paramId = nil, paramEvents = nil )
		super paramId, paramEvents
	end
end