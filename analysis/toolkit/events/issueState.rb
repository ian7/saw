require_relative 'logEvent.rb'

class IssueStateEvent < LogEvent
	def self.find( issueLogItem, treshold = nil )	
		stateEvents = []

		interestingEvents =[]


		issueLogItem.alternatives.each do |alternative| 
			interestingEvents.concat alternative.events.select{ |event| 
				event.class == CreationEvent || event.class == DecisionEvent || event.class == DestructionEvent 
			}
		end


			interestingEvents.concat( issueLogItem.events.select{ |x| x.class == CreationEvent || x.class == DestructionEvent} )
			interestingEvents.sort!  { |x,y| x.time.to_i <=> y.time.to_i }


#			puts "total interesting events: #{interestingEvents.size.to_s} for: #{issueLogItem.id.to_s} "

			interestingEvents.each do |x|

				newState = self.integrateState( issueLogItem, x.time.to_i )
				
				if( stateEvents.size == 0 || stateEvents.last.state != newState )
#					debugger 
					stateEvents << IssueStateEvent.new( x, newState )
				end
			end




		#let's sort this stuff first. 
		stateEvents.sort! { |x,y| x.time.to_i <=> y.time.to_i }

# if squasing works well above, then this is redundant
=begin
		squashedStateEvents = []

		#before returning them, it would be good to squash duplicates 
		stateEvents.each_with_index do |event,index|
			# let's put the first one
			if index == 0
				squashedStateEvents << event
			end
			# and then whatever alters it
#			debugger
			if event.state != squashedStateEvents.last.state
				squashedStateEvents << event
			end
		end

		puts "after squashing: #{stateEvents.size.to_s}, #{squashedStateEvents.size.to_s}"
		return squashedStateEvents
=end
		return stateEvents
	end

	def self.integrateState( issueLogItem, treshold = 999999999 )
		alternativesEvents = issueLogItem.alternatives( treshold ).map{ |x| x.events }.flatten(1).select{ |x| x.time.to_i <= treshold.to_i }
		# it would be probably good to check if they are all related to us - but for the moment let's just ignore it. 
		relationEvents = alternativesEvents.select{ |x| x.class == CreationEvent }

		if issueLogItem.alternatives( treshold )
#			debugger
		end

		# this one is easy
		if relationEvents.size == 0
			return 'no alternatives'
		end

		decisionEvents = alternativesEvents.select{ |x| x.class == DecisionEvent }

		if decisionEvents.size == 0
			return 'no positions'# t: ' + treshold.to_s + ' (' + issueLogItem.alternatives(treshold).map{ |x| x.id }.join(" ") + ")"
		end


		if issueLogItem.alternatives( treshold ).find {|x| x.state(treshold) != 'alligned' }
			return 'incomplete'# ('  + issueLogItem.alternatives(treshold).map{ |x| x.id }.join(" ") + ")"
		end

		return 'complete'# (' + issueLogItem.alternatives(treshold).map{ |x| x.id }.join(" ") + ")"
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

	 def state
	 	return @state
	 end
end
