require_relative 'logEvent.rb'

class DecisionEvent < LogEvent
	def initialize( param )
		super( param )
		@decision = Taggable.find self.taggingTip
	end
	def decision 
		return @decision
	end
	def to_s
		return self.time + "\t" + 'decision' + "\t" + @decision['name'] + "\t" + self.user 
	end
end
