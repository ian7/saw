require_relative './indicator.rb'
require 'descriptive_statistics'

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

		pm = ProjectMapper.new

		# it is actually questionable if we should do it
		#allIssues = @issues.select{|issue| issue["Destroyed"] == "0"}
		allIssues = @issues

		sawIssues = allIssues.select{ |issue| issue["Project"].length > 5 }
		epIssues = allIssues.select{ |issue| issue["Project"].length <= 5 }

		buckets.each{ |bucket|
			lineOut = []

	#		debugger
			epIssuesInBucket = epIssues.select{ |issue| issue['Alternatives Count'].to_i == bucket }.length
			sawIssuesInBucket = sawIssues.select{ |issue| issue['Alternatives Count'].to_i == bucket }.length
			lineOut << "{" + bucket.to_s + "\\\\(" + epIssuesInBucket.to_s + "," + sawIssuesInBucket.to_s + ")}"
			lineOut << epIssuesInBucket
			lineOut << sawIssuesInBucket
			lineOut << epIssuesInBucket*100 / epIssues.length						
			lineOut << sawIssuesInBucket*100 / sawIssues.length
			
			out << lineOut
		}
		# now let's dump some digested data:
		print "SAW " 
		issueStats( sawIssues )

		print "EP " 
		issueStats( epIssues )
#		debugger
		return out
	end

	def issueStats( population)
		alternativeCounts = population.map{ |issue| issue['Alternatives Count'].to_i }
		puts "avg: " + alternativeCounts.mean.to_s + " sd: " + alternativeCounts.standard_deviation.to_s
	end

end