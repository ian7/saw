require_relative 'metric.rb'
require_relative 'projectActivity.rb'

class UserActivityMetric < Metric
	def self.name
		return "UserActivity"
	end
	def self.header
		fields = [
			"User Name",
		]
		return fields

	end
	def self.suitableItems
		return [ UserLogItem ]
	end
	def self.calculate( user, extraFilter=nil )
		state = []
			
#		state << user.name

		user.projects.each do |project|
			lineOut = []
			extraFilter = Proc.new{ |e| 
				e.user==user.name }
			state << project.status( extraFilter )
		end

		return state
	end
end