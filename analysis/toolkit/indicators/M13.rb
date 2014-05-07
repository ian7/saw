require_relative './indicator.rb'

class M13 < Indicator

	def header
		fields = [
			"Last decision Issues",
			"Last decision Issues percent",
			"Last decision Issues sum",
			"Last decision Alternatives",
			"Last decision Alternatives percent",
			"Last decision Alternatives sum",
		]
		fields = ["Timespan bucket","Label"] + fields.map{|x| x+" EP"} + fields.map{|x| x+" SAW"}
	end
	def calculateBucket( lineOut, bucket, issues, alternatives )

			#bucketMinutes = bucket*10

			bucketIssues = issues.select{ |issue| 
				#debugger
				(issue['Time since last decision'].to_i) > bucket*10*60 && 
				(issue['Time since last decision'].to_i) < (bucket+1)*10*60-1
			}
			lineOut << bucketIssues.size

			issuesPercent = bucketIssues.size.to_f*100 / issues.size.to_f
			lineOut << issuesPercent

			@issuesSum += issuesPercent
			lineOut << @issuesSum

			bucketAlternatives = alternatives.select{ |alternative| 
				(alternative['Time since last decision'].to_i) > bucket*10*60 && 
				(alternative['Time since last decision'].to_i) < (bucket+1)*10*60-1
			}
			lineOut << bucketAlternatives.size

			alternativesPercent = bucketAlternatives.size.to_f*100 / alternatives.size.to_f
			lineOut << alternativesPercent

			@alternativesSum += alternativesPercent
			lineOut << @alternativesSum

	end

	def calculate
		out = []

		buckets = (0..8)

		@issuesSum = 0.0
		@alternativesSum = 0.0
		@issuesSumEP = 0.0
		@alternativesSumEP = 0.0
		@issuesSumSAW = 0.0
		@alternativesSumSAW = 0.0

		buckets.each{ |bucket|
			lineOut = []
			lineOut << bucket*10
			lineOut << "bucked placeholder"


			calculateBucket( lineOut, bucket, @issues.select{|x| x.isEP}, @alternatives.select{|x| x.isEP} )
			calculateBucket( lineOut, bucket, @issues.select{|x| x.isSAW}, @alternatives.select{|x| x.isSAW} )
			
			@issuesSumEP += lineOut[3]
			lineOut[4] = @issuesSumEP
			@alternativesSumEP += lineOut[6]
			lineOut[7] = @alternativesSumEP

			@issuesSumSAW += lineOut[9]
			lineOut[10] = @issuesSumSAW
			@alternativesSumSAW += lineOut[12]
			lineOut[13] = @alternativesSumSAW

			lineOut 
	
			out << lineOut
		}
		return out
	end
end