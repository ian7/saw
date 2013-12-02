require_relative './indicator.rb'

class M11 < Indicator
	def header
		fields = [
			"Decision state",
			"no positions",
			"aligned",
			"colliding",
		]
	end
	def calculate
		out = []

		decisionStates = [
			"no positions",
			"aligned",
			"colliding"
		]

		decisionStates.each{ |decisionState|
			lineOut = []

			lineOut << decisionState
			filteredAlternatives = @alternatives.select{ |x| x["Final State"] == decisionState }

			timeSums = {}
			decisionStates.each{ |x| timeSums[x] = 0 }
			decisionStates.each { |x|
				filteredAlternatives.each{ |alternative| timeSums['no positions'] += alternative["Time In NoPositions"].to_i }
				filteredAlternatives.each{ |alternative| timeSums['aligned'] += alternative["Time In Aligned"].to_i }
				filteredAlternatives.each{ |alternative| timeSums['colliding'] += alternative["Time In Colliding"].to_i }

			}
			allTimesSum = 0
			decisionStates.each {|ds| allTimesSum += timeSums[ds] }
			decisionStates.each {|ds| lineOut << timeSums[ds].to_f * 100/allTimesSum }
			out << lineOut
		}

		lineOut = []
		lineOut << "all"
		filteredAlternatives = @alternatives
		timeSums = {}
		decisionStates.each{ |x| timeSums[x] = 0 }

		decisionStates.each { |x|
			filteredAlternatives.each{ |alternative| timeSums['no positions'] += alternative["Time In NoPositions"].to_i }
			filteredAlternatives.each{ |alternative| timeSums['aligned'] += alternative["Time In Aligned"].to_i }
			filteredAlternatives.each{ |alternative| timeSums['colliding'] += alternative["Time In Colliding"].to_i }
		}

		allTimesSum = 0
		decisionStates.each {|ds| allTimesSum += timeSums[ds]}
		decisionStates.each {|ds| lineOut << timeSums[ds].to_f * 100/allTimesSum }
		out << lineOut

		return out
	end
end