require_relative './indicator.rb'

class M5 < Indicator
	def header
		fields = [
			"Activity Timespan Issues",
			"Activity Timespan Issues percent",
			"Activity Timespan Issues sum",
			"Activity Timespan Alternatives",
			"Activity Timespan Alternatives percent",
			"Activity Timespan Alternatives sum",
		]

		fields = ["Timespan bucket","Label Issues","Label Alternatives"] + fields.map{|x| x+" ALL"} + fields.map{|x| x+" EP"} + fields.map{|x| x+" SAW"}
		return fields
	end

	def calculateBucket( lineOut, bucket, issues, alternatives )

		issuesSum = 0.0
		alternativesSum = 0.0

		bucketIssues = issues.select{ |issue| 
			(issue['Activity Time'].to_i) > bucket*10*60 && 
			(issue['Activity Time'].to_i) < (bucket+1)*10*60-1
		}
		lineOut << bucketIssues.size

		issuesPercent = bucketIssues.size.to_f*100 / issues.size.to_f
		lineOut << issuesPercent

		issuesSum += issuesPercent
		lineOut << issuesSum

		bucketAlternatives = alternatives.select{ |alternative| 
			(alternative['Activity Time'].to_i) > bucket*10*60 && 
			(alternative['Activity Time'].to_i) < (bucket+1)*10*60-1
		}
		lineOut << bucketAlternatives.size

		alternativesPercent = bucketAlternatives.size.to_f*100 / alternatives.size.to_f
		lineOut << alternativesPercent

		alternativesSum += alternativesPercent
		lineOut << alternativesSum
	end

	def calculate
		out = []

		buckets = (0..8)
		#issuesSum = 0.0
		#alternativesSum = 0.0

		buckets.each{ |bucket|
			lineOut = []
			bucketText =  "#{(bucket*10)} -- #{((bucket+1)*10 - 1)}"
			lineOut << bucketText
			lineOut << "label Issues Placeholder"
			lineOut << "label Alternatives Placeholder"
			calculateBucket( lineOut, bucket, @issues, @alternatives)
			calculateBucket( lineOut, bucket, @issues.select{|x| x.isEP}, @alternatives.select{|x| x.isEP})
			calculateBucket( lineOut, bucket, @issues.select{|x| x.isSAW}, @alternatives.select{|x| x.isSAW})
			#bucketMinutes = bucket*10
			
			#let's fill in the placeholders
			lineOut[1] = "\{#{bucketText}\\\\(#{lineOut[9]},#{lineOut[15]})\}" 
			lineOut[2] = "\{#{bucketText}\\\\(#{lineOut[12]},#{lineOut[18]})\}" 

			out << lineOut
		}
		return out
	end
end