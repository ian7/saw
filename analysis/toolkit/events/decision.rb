require_relative 'logEvent.rb'

class DecisionEvent < LogEvent

	def self.find( id, events, treshold = nil )

		if( treshold )
			cutEvents = events.select { |x| x.time.to_i <= treshold }
		else
			cutEvents = events
		end

		# this should catch SAW decisions
		de = []
		cutEvents.select{ |x| x.id == id && x.controller == 'TagController' && x.action == 'dotag' } .each { |x| 
			# this is going to find decision making events. 


			newEvent = DecisionEvent.new( x ) 
			de << newEvent

			# let's find position first. 
			position = cutEvents.find{|y| y.time == x.time && y.verb=='notify' && y.distance=="0" && y.itemType=="Tagging"}

			if position 
				positionID = position.to_id

				# and then find when it was revoked
				decisionRevokeEvent = cutEvents.find{|z| 
					z.to_id == positionID && 
					z.verb == "PUT" && 
					z.parameters["revoked"] != "nil" }			
				
				if decisionRevokeEvent
					de << DecisionEvent.new( decisionRevokeEvent,"Anti"+newEvent.decision  )
				end

				# this is an interesting anti-decison case
				if x.id == "51933360da300c175e000003"
#					debugger
				end

			end

		}

		#this should catch EP encoded decisions
		de.concat cutEvents.select{ |x| x.to_id == id && x.controller == 'decide'} . map{ |x|
			DecisionEvent.new( x )
		}
		#debugger

		de.each do |x|
			x.state = DecisionEvent.integrateState( de.select { |y| y.time.to_i <= x.time.to_i })
		end
		#debugger
		return de
	end

	def self.anihilate( decisions )
		compactedDecisions = decisions.select{ |x| x.decision.match('Anti') == nil }

		decisions.select{|x| x.decision.match(/Anti/)} .each{ |antiDecision| 
			proDecision = compactedDecisions.find{ |x| 
				x.user == antiDecision.user &&
				x.time.to_i < antiDecision.time.to_i
				x.decision == antiDecision.decision.gsub("Anti","")
			}
			if( proDecision )
				#debugger
				#print proDecision.to_s
				compactedDecisions.delete proDecision
			end
		}
		return compactedDecisions
	end

	def self.integrateState( decisions )
		#debugger

		decisions = self.anihilate( decisions )

		if( decisions.length == 0 )
			return 'no positions'
		end
		if( decisions.length == 1 )
			#decided was good enough, but practically it means 'alligned'
#			return 'decided'	
			return 'aligned'
		end

		firstD = decisions[0]
		
		decisions.each do |d|
			if d.decision != firstD.decision
				return 'colliding'
			end
		end
		return 'aligned'
	end

	def decisionName
		return @decision['name']
	end

	def initialize( param, decisionOverride = nil)

		super( param )
		@state = "no positions"

		if Taggable.exists? :conditions=>{:id=>self.taggingTip }
			@decision = Taggable.find(self.taggingTip)['name']
			@positionID = self.id
			if self.id == '51933360da300c175e000003'
			#	debugger
			end
		else
			@decision = self.param
		end

		if decisionOverride
			@decision = decisionOverride
		end

	end
	def decision 
		return @decision
	end
	def state=( value )
		@state = value
	end
	def state
		return @state
	end
	def to_s( item = nil)
		retval = self.time + "\t" + 'decision' + "\t" + @decision + "\t" + self.user + "\t" + @state
		if @positionID
			retval += " " + @positionID
		end
		return  retval
	end
end
