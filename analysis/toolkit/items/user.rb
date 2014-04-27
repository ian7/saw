require_relative './logItem.rb'

class UserLogItem < LogItem
	def initialize( name, projects )
		@name = name
		@projects = projects
		super nil, nil, nil
	end
	def analyze( logType = :SAW )
	end
	def projects
		return @projects
	end
	def name
		return @name
	end
end
