
require_relative './logItem.rb'
require_relative './alternative.rb'


class IssueLogItem < LogItem
	def self.find( events, projectID = nil)
#		debugger
		return events.select { |x| 
			x.itemType == 'Issue' && x.controller == 'create'}. map { |x| IssueLogItem.new( x.to_id, events, projectID )
			}
	end

	def initialize( paramId = nil, paramEvents = nil, projectID = nil)
		#puts paramId.to_s
		super paramId, paramEvents, projectID
	end
	def alternatives( treshold = nil )
		if treshold
			pre = @alis.select do |a|
				ce = a.events.find{ |e| e.class == CreationEvent } 
				de = a.events.find{ |e| e.class == DestructionEvent } 
				case
				when (not ce)
					false
				when (ce.time.to_i > treshold)
					false
				when (de && de.time.to_i < treshold)
					false
				else
					true
				end
			end
			return pre.uniq {|x| x.id }
		else
			return @alis
		end
	end
	def analyze( logType = :SAW )
		@events = []
		eventClasses = [ CreationEvent,UpdateEvent,FocusEvent,RelationEvent,DestructionEvent ]
		eventClasses.each{ |x| @events.concat( x.find( self.id, @allEvents ) ) }


		if( logType == :SAW )
			@alis = alternativesLog.map { |x| AlternativeLogItem.new( x, @allEvents, @projectID ) }
		else
			@alis = alternativesEP.map { |x| AlternativeLogItem.new( x, @allEvents, @projectID ) }
		end


		#let's analyze them for the deicsions
		@alis.each{ |x|
			#puts 'analyzing ' + x.id.to_s
			x.analyze 
			x.to_s
		}
	
=begin	
		#let's go over the relations
		#
		RelationEvent.find( self.id, @allEvents ).each do |relation|
			relatedAlternative = @alis.find { |x| relation.related_from == x.id || relation.id == x.id }
			if( relatedAlternative )
				#print 'relatedAlternative found: ' + relatedAlternative.id

				#@events.concat( relatedAlternative.events.select { |x| x.class == DecisionEvent } )
				
				# let's find what interesting is going on for the alternative 
				des = relatedAlternative.events.select { |x| x.class == DecisionEvent || x.class == CreationEvent || x.class == DestructionEvent}
				
				# but we also drop some stuff rom the issue 
				des.concat( CreationEvent.find( self.id, @allEvents ) )

				#puts "with " + des.size.to_s + " decisions"

				des.each do |decision|
					#puts decision.decision['name'].to_s + " " + decision.time + " " + decision.state
					@events.concat( integrate_state( decision.time ) )
				end
			else
				puts 'whoops, related Alternative not found'
			end

		end
=end
		@events.concat alternatives.map{ |a| a.events }.flatten(1).select{ |e| e.class == DecisionEvent }
		@events.concat IssueStateEvent.find( self )

		@sortedEvents = @events.sort {|x,y| x.time.to_i <=> y.time.to_i }
	end

	def integrate_state( treshold )

		# find all that happened before the treshold
		cutEvents = @allEvents.select { |x| x.time <= treshold }

		res = RelationEvent.find( self.id, cutEvents )

		#puts res.size.to_s + " younger (" + treshold.to_s + ") alternatives found"

		#this serves state zero
		if res.size == 0 
			return []
		end

		totalDecisions = 0
		alternativeDecisionStats = {}

		res.each do |relation|
			relatedAlternative = @alis.find { |x| relation.related_from == x.id || relation.id == x.id }

			alternativeDecisions = relatedAlternative.events.select { |x| x.class == DecisionEvent && x.time <= treshold }
			allAlternativeDecisions = relatedAlternative.events.select { |x| x.class == DecisionEvent }

			#print relatedAlternative.id.to_s + " " + alternativeDecisions.size.to_s + "/" + allAlternativeDecisions.size.to_s + " " + treshold.to_s + " "

			alternativeState = ""
			if alternativeDecisions.size > 0 
				alternativeState = alternativeDecisions.last.state.to_s
			else
				alternativeState = "none"
			end

			#puts alternativeState

			alternativeDecisionStats[ alternativeState ] = alternativeDecisionStats[ alternativeState ].to_i + 1

			totalDecisions = totalDecisions + alternativeDecisions.size
		end

#		print "Total decisions: " + totalDecisions.to_s
#		print " "
#		puts 
#		puts alternativeDecisionStats.to_s

		if totalDecisions== 0
#			return "no decisions"
		end


		reportedState = getIssueState( alternativeDecisionStats ) + " " + alternativeDecisionStats.to_s

		return [ IssueStateEvent.new( [ "0.0.0.0",treshold.to_s ],  reportedState) ]

	end

	def getIssueState( alternativeDecisionStats )

		# with no alternaitves
		if alternativeDecisionStats.size == 0 
			return 'no alternatives'
		end

		#with no decisions
		if alternativeDecisionStats.size == 1 && alternativeDecisionStats['none']
			return 'no decisions'
		end
 
		#only alligned decisions
		if alternativeDecisionStats.size == 1 && alternativeDecisionStats['alligned']
			return 'complete'
		end

		#everything else
		return 'incomplete'
	end
	def to_s( output = nil )
		#puts "puts'ing " + @sortedEvents.size.to_s
		@sortedEvents.each do |x|
			@output.puts x.to_s( self ) 
		end
	end
	def alternativesSnapshot
		if @taggable 
			return	@taggable.related_to "SolvedBy"
		else
			return []
		end
	end
	def alternativesLog
		#puts 'analyzing alternatives for: ' + self.id.to_s 
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
					#print "alternative doesn't exist any more (id: " + re.to_id.to_s + " )"
					# let's find how long did it exist
					delEvent = @allEvents.find {|x| x.verb == 'notify' && x.controller == 'destroy' && x.to_id == re.to_id }
					if delEvent 
						#print 'existed for: ' + (delEvent.time.to_i - re.time.to_i).to_s  + " seconds"
					else
					#	print 'no del found'
					end
					#puts ""
				end
			end
		end

#		puts 'Found: ' + alternatives.size.to_s + ' alternatives in log, but ' + alternativesSnapshot.size.to_s + " in graph"
		return alternatives
	end
	def alternativesEP
		doTagEvents = @allEvents.select {|x| x.itemType == 'Alternative' && x.action == 'relate' && x.payload == @id }.map{ |x| x.item_id }
		return doTagEvents
	end
end
