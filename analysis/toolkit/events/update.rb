require_relative 'logEvent.rb'

class UpdateEvent < LogEvent

	def self.find( id, events, treshold = 0 )
		# i needed to relax this in order to support EP
		#return events.select { |x| x.verb == 'PUT' && x.action == 'update' && x.to_id == id } .map { |x| UpdateEvent.new(x) } 
		return events.select { |x| x.action == 'update' && x.to_id == id } .map { |x| UpdateEvent.new(x) } 
	end

	def initialize( param )
		super( param )
	end
	def to_s( item )
		ce = CreationEvent.find( self.to_id, item.allEvents ).first

		if ce
			return self.time + "\tupdate\t" + self.user + "\t" + (self.time.to_i - ce.time.to_i).to_s
		else
			return self.time + "\tupdate\t" + self.user + "\t" + "-1"
		end

	end
end
