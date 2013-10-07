require_relative 'logEvent.rb'

class DecisionEvent < LogEvent

	def self.find( id, events, treshold = nil )

		if( treshold )
			cutEvents = events.select { |x| x.time.to_i <= treshold }
		else
			cutEvents = events
		end

		de = cutEvents.select{ |x| x.id == id && x.controller == 'TagController' && x.action == 'dotag' } .map { |x| 
			#puts x
			DecisionEvent.new( x ) 
		}

		de.each do |x|
			x.state = DecisionEvent.integrateState( de.select { |y| y.time.to_i <= x.time.to_i })
		end

		return de
	end

	def self.integrateState( decisions )
		#debugger
		if( decisions.length == 0 )
			return 'no positions'
		end
		if( decisions.length == 1 )
			#decided was good enough, but practically it means 'alligned'
#			return 'decided'	
			return 'alligned'
		end

		firstD = decisions[0]
		
		decisions.each do |d|
			if d.decision != firstD.decision
				return 'conflicting'
			end
		end
		return 'alligned'
	end

	def decisionName
		return @decision['name']
	end

	def initialize( param )

		super( param )
		@state = "haha"
		@decision = Taggable.find self.taggingTip
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
		return self.time + "\t" + 'decision' + "\t" + @decision['name'] + "\t" + self.user + "\t" + @state
	end
end
