require_relative './indicator.rb'

class M15 < Indicator
	def header
		fields = [
			"Number of choice changes",
			"Issues count",
			"Issues percent",
			"Issues in NoAlternatives",
			"Issues in NoPositions",
			"Issues in Incomplete",
			"Issues in Complete",
		]
	end
	def calculate
		out = []

		buckets = (1..7)

		buckets.each{ |bucket|
			lineOut = []
			filteredIssues = @issues.select{ |x| 
				x['ChoiceState Changes'].to_i == bucket &&
				x['Destroyed'] == "0"
			}
			lineOut << "#{bucket.to_s}\\\\(#{ filteredIssues.size })"
			lineOut << filteredIssues.size
			lineOut << filteredIssues.size.to_f * 100 / @issues.size

			lineOut << filteredIssues.select{ |x| x['Final Choice'] == "no alternatives"}.size.to_f*100/filteredIssues.size
			lineOut << filteredIssues.select{ |x| x['Final Choice'] == "no positions"}.size.to_f*100/filteredIssues.size
			lineOut << filteredIssues.select{ |x| x['Final Choice'] == "incomplete"}.size.to_f*100/filteredIssues.size
			lineOut << filteredIssues.select{ |x| x['Final Choice'] == "complete"}.size.to_f*100/filteredIssues.size

			out << lineOut
		}
		return out
	end
end