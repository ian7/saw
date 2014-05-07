require_relative './indicator.rb'

class M15 < Indicator
	def header
		fields = [
			"Issues count",
			"Issues percent",
			"Issues in NoAlternatives",
			"Issues in NoPositions",
			"Issues in Incomplete",
			"Issues in Complete",
		]
		fields = ["Number of choice changes","Label"] + fields.map{|x| x+" EP"} + fields.map{|x| x+" SAW"}
	end
	def calculateBucket( lineOut, bucket, issues, alternatives )
		filteredIssues = issues.select{ |x| 
				x['ChoiceState Changes'].to_i == bucket &&
				x['Destroyed'] == "0"
			}
			#lineOut << "#{bucket.to_s}\\\\(#{ filteredIssues.size })"
			lineOut << filteredIssues.size
			lineOut << filteredIssues.size.to_f * 100 / issues.size

			if filteredIssues.size > 0 
				lineOut << filteredIssues.select{ |x| x['Final Choice'] == "no alternatives"}.size.to_f*100/filteredIssues.size
				lineOut << filteredIssues.select{ |x| x['Final Choice'] == "no positions"}.size.to_f*100/filteredIssues.size
				lineOut << filteredIssues.select{ |x| x['Final Choice'] == "incomplete"}.size.to_f*100/filteredIssues.size
				lineOut << filteredIssues.select{ |x| x['Final Choice'] == "complete"}.size.to_f*100/filteredIssues.size
			else
				lineOut << "0"
				lineOut << "0"
				lineOut << "0"
				lineOut << "0"
			end
	end	
	def calculate
		out = []

		buckets = (1..7)

		buckets.each{ |bucket|
			lineOut = []

			lineOut << "#{bucket.to_s}"
			lineOut << "label placeholder"

			calculateBucket( lineOut, bucket, @issues.select{|x| x.isEP}, @alternatives.select{|x| x.isEP} )
			calculateBucket( lineOut, bucket, @issues.select{|x| x.isSAW}, @alternatives.select{|x| x.isSAW} )

			lineOut[1] = "#{lineOut[0]}\\\\(#{lineOut[2]},#{lineOut[8]})"
	
			out << lineOut
		}
		return out
	end
end