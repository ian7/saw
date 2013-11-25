require_relative './indicator.rb'

class M2 < Indicator
	def header
		fields = [
			"Alternatives Count",
			"EP",
			"SAW",
			"EP percent",
			"SAW percent"
		]
	end
	def calculate
		out = []

		buckets = (0..6)

		allIssues = @issues.select{|issue| issue["Destroyed"] == "0"}

		sawIssues = allIssues.select{ |issue| issue["Project"].length > 5 }
		epIssues = allIssues.select{ |issue| issue["Project"].length <= 5 }

		buckets.each{ |bucket|
			lineOut = []

	#		debugger
			lineOut << bucket
			lineOut << epIssues.select{ |issue| issue['Alternatives Count'].to_i == bucket }.length
			lineOut << sawIssues.select{ |issue| issue['Alternatives Count'].to_i == bucket }.length
			lineOut << epIssues.select{ |issue| issue['Alternatives Count'].to_i == bucket }.length*100 / epIssues.length						
			lineOut << sawIssues.select{ |issue| issue['Alternatives Count'].to_i == bucket }.length*100 / sawIssues.length
			
			out << lineOut
		}
		return out
	end
end