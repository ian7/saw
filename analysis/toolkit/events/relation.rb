require_relative 'logEvent.rb'

class RelationEvent < LogEvent
	def self.find( id, events, treshold = 0 )		
#		return events.select { |x| x.controller == "RelationController" && x.action == 'relate' && ( x[10] == id || x[11] == id) }. map {|x| RelationEvent.new( x )}
#		debugger
		return events.select { |x| x.action == 'relate' && ( x[10] == id || x[11] == id || x.payload == id) }. map {|x| RelationEvent.new( x )}
	end

	def self.integrateIssueState( events )
	end

	def initialize( event, origin=nil, tip=nil)
		super( event )
		@origin = origin
		@tip = tip
	end
	def to_s( item = nil )
		return self.time + "\t" + 'relation created' + "\t from: " + self.related_from + "\t to: " + self.related_to.to_s + " " + self.id + "\t" + self.user 
	end
end
