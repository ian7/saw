
require_relative './logItem.rb'
require_relative './alternative.rb'


class IssueLogItem < LogItem
	def initialize( paramId = nil, paramEvents = nil )
		super paramId, paramEvents
	end
	def status
	end
	def analyze( output )
		@output.puts creation.to_s
		update.each do |x|
			@output.print x.to_s + "\t"
			@output.print (x.time.to_i-creation.time.to_i ).to_s + "\t"
			@output.print "\n"
		end
		focus.each do |x|
			@output.print x.to_s + "\t"
			@output.print "\n"
		end
		alis = alternativesLog.map {|x| AlternativeLogItem.new x, @allEvents }
	end
	def creation
		e = @filteredEvents.find { |x| x.controller == 'create' && x.distance == '0' && x.itemType == 'Issue'}
		if( e )
			return CreationEvent.new( e )
		else
			puts 'no creation event for the issue: '
		end
	end
	def alternativesSnapshot
		return	@taggable.related_to "SolvedBy"
	end
	def alternativesLog
		puts 'analyzing alternatives for: ' + self.id.to_s 
		doTagEvents = @filteredEvents.select {|x| x.action == 'Notify' && x.controller == 'relate' && x.distance == '1'}
		
		alternatives = []

		doTagEvents.each do |dte|


			re = @allEvents.find {|x| 
				x.time == dte.time && 
				x.action == 'Notify' && x.controller == 'relate' &&
				x.distance == '1' &&
				x.itemType == 'Alternative'} 
			if re 
				if Taggable.exists? :conditions=>{:id=>re.to_id}
					alternatives.push re.to_id
				else
					alternatives.push re.to_id
					# if it really doesn't exist, then...
					print "alternative doesn't exist any more (id: " + re.to_id.to_s + " )"
					# let's find how long did it exist
					delEvent = @allEvents.find {|x| x.verb == 'notify' && x.controller == 'destroy' && x.to_id == re.to_id }
					if delEvent 
						print 'existed for: ' + (delEvent.time.to_i - re.time.to_i).to_s  + " seconds"
					else
						print 'no del found'
					end
					puts
				end
			end
		end

		puts 'Found: ' + alternatives.size.to_s + ' alternatives in log, but ' + alternativesSnapshot.size.to_s + " in graph"
		return alternatives
	end
end
