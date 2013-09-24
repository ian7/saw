require_relative 'logEvent.rb'

class CreationEvent < LogEvent
	def to_s
		return self.time + "\t" + 'creation' + "\t" + self.user + "\n"
	end
end
