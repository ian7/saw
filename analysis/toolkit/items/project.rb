require_relative './logItem.rb'

class ProjectLogItem < LogItem
	def initialize( projectID = nil, paramEvents = nil)
		super projectID, paramEvents, projectID
	end
	def analyze( logType = :SAW )
	end
	def issues=( issueList )
		@issues = issueList
	end
	def issues
		return @issues
	end
	def allAlternatives
		all = []
		@issues.each{ |issue| 
			all.concat issue.alternatives
		}
		return all
	end
end
