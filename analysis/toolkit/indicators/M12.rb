require_relative './indicator.rb'

class M12 < Indicator
	def header
		fields = [
			"Choice state",
			"no alternatives",
			"no positions",
			"incomplete",
			"complete",
		]
	end
	def calculate
		out = []

		choiceStates = [
			"no alternatives",
			"no positions",
			"incomplete",
			"complete"
		]

		choiceStates.each{ |choiceState|
			lineOut = []

			filteredIssues = @issues.select{ |x| x["Final Choice"] == choiceState }
			lineOut << "#{choiceState}\\\\(#{filteredIssues.size.to_s})"

			timeSums = {}
			choiceStates.each{ |x| timeSums[x] = 0 }
			choiceStates.each { |x|
				filteredIssues.each{ |issue| timeSums['no alternatives'] += issue["Time In NoAlternatives"].to_i }
				filteredIssues.each{ |issue| timeSums['no positions'] += issue["Time In NoPositions"].to_i }
				filteredIssues.each{ |issue| timeSums['incomplete'] += issue["Time In Incomplete"].to_i }
				filteredIssues.each{ |issue| timeSums['complete'] += issue["Time In Complete"].to_i }

			}
			allTimesSum = 0
			choiceStates.each {|ds| allTimesSum += timeSums[ds] }
			choiceStates.each {|ds| lineOut << timeSums[ds].to_f * 100/allTimesSum }
			out << lineOut
		}

		lineOut = []
		filteredIssues = @issues
		lineOut << "all\\\\(#{filteredIssues.size.to_s})"
		timeSums = {}

		choiceStates.each{ |x| timeSums[x] = 0 }
		choiceStates.each { |x|
				filteredIssues.each{ |issue| timeSums['no alternatives'] += issue["Time In NoAlternatives"].to_i }
				filteredIssues.each{ |issue| timeSums['no positions'] += issue["Time In NoPositions"].to_i }
				filteredIssues.each{ |issue| timeSums['incomplete'] += issue["Time In Incomplete"].to_i }
				filteredIssues.each{ |issue| timeSums['complete'] += issue["Time In Complete"].to_i }

			}

		allTimesSum = 0
		choiceStates.each {|ds| allTimesSum += timeSums[ds]}
		choiceStates.each {|ds| lineOut << timeSums[ds].to_f * 100/allTimesSum }
		out << lineOut

		return out
	end
end