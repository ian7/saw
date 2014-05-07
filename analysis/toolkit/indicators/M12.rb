require_relative './indicator.rb'

class M12 < Indicator
	def header
		fields = [
			"Issue count",
			"no alternatives",
			"no positions",
			"incomplete",
			"complete",
		]
		fields = ["Choice state", "Label"] +  fields.map{|x| x+" EP"} + fields.map{|x| x+" SAW"}
	end

	def calculateBucket( lineOut, bucket, issues, alternatives )

		choiceStates = [
			"no alternatives",
			"no positions",
			"incomplete",
			"complete"
		]
		if bucket != "all"
			filteredIssues = issues.select{ |x| x["Final Choice"] == bucket}
		else
			filteredIssues = issues
		end

		lineOut << "#{filteredIssues.size.to_s}"

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
		if allTimesSum > 0
			choiceStates.each {|ds| lineOut << timeSums[ds].to_f * 100/allTimesSum }
		else
			choiceStates.each {|ds| lineOut << "0" }
		end

	end

	def calculate
		out = []

		choiceStates = [
			"no alternatives",
			"no positions",
			"incomplete",
			"complete",
			"all"
		]

		choiceStates.each{ |choiceState|
			lineOut = []

			lineOut << "#{choiceState}"
			lineOut << "Label placeholder"

			calculateBucket( lineOut, choiceState, @issues.select{|x| x.isEP}, @alternatives.select{|x| x.isEP} )
			calculateBucket( lineOut, choiceState, @issues.select{|x| x.isSAW}, @alternatives.select{|x| x.isSAW} )

			lineOut[1] = "#{lineOut[0]}\\\\(#{lineOut[2]},#{lineOut[7]})"

			out << lineOut

		}


		return out
	end
end