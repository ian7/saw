require_relative './indicator.rb'

class M11 < Indicator
	def header
		fields = [
			"Alternative count",
			"no positions",
			"aligned",
			"colliding",
		]
		fields = ["Decision state", "Label"] +  fields.map{|x| x+" EP"} + fields.map{|x| x+" SAW"}
	end

	def calculateBucket( out, bucket, issues, alternatives )
			decisionStates = [
				"no positions",
				"aligned",
				"colliding",
	#			"all"
			]

			lineOut = out

			if bucket == "all"
				filteredAlternatives = alternatives
			else
				filteredAlternatives = alternatives.select{ |x| x["Final State"] == bucket }
			end

			lineOut << "#{filteredAlternatives.size.to_s}"

			timeSums = {}
			decisionStates.each{ |x| timeSums[x] = 0 }
			decisionStates.each { |x|
				filteredAlternatives.each{ |alternative| timeSums['no positions'] += alternative["Time In NoPositions"].to_i }
				filteredAlternatives.each{ |alternative| timeSums['aligned'] += alternative["Time In Aligned"].to_i }
				filteredAlternatives.each{ |alternative| timeSums['colliding'] += alternative["Time In Colliding"].to_i }

			}
			allTimesSum = 0
			decisionStates.each {|ds| allTimesSum += timeSums[ds] }
			if allTimesSum > 0
				decisionStates.each {|ds| lineOut << timeSums[ds].to_f * 100/allTimesSum }
			else
				decisionStates.each {|ds| lineOut << "0"}
			end				
			#out << lineOut
end

	def calculate
		out = []

		decisionStates = [
			"no positions",
			"aligned",
			"colliding",
			"all"
		]

		decisionStates.each{ |bucket|
			lineOut = []

			lineOut << "#{bucket}"
			lineOut << "Label placeholder"

			calculateBucket( lineOut, bucket, @issues.select{|x| x.isEP}, @alternatives.select{|x| x.isEP} )
			calculateBucket( lineOut, bucket, @issues.select{|x| x.isSAW}, @alternatives.select{|x| x.isSAW} )

			lineOut[1] = "#{lineOut[0]}\\\\(#{lineOut[2]},#{lineOut[6]})"
			out << lineOut
		}
		return out
	end
end