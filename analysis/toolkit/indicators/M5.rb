require_relative './indicator.rb'

class M5 < Indicator
	def header
		fields = [
			"Timespan bucket",
			"Activity Timespan Issues",
			"Activity Timespan Issues percent",
			"Activity Timespan Issues sum",
			"Activity Timespan Alternatives",
			"Activity Timespan Alternatives percent",
			"Activity Timespan Alternatives sum",
		]
	end
	def calculate
		out = []

		buckets = (0..8)

		issuesSum = 0.0
		alternativesSum = 0.0

		buckets.each{ |bucket|
			lineOut = []

			lineOut << bucket*10

			#bucketMinutes = bucket*10

			bucketIssues = @issues.select{ |issue| 
				(issue['Activity Time'].to_i) > bucket*10*60 && 
				(issue['Activity Time'].to_i) < (bucket+1)*10*60-1
			}
			lineOut << bucketIssues.size

			issuesPercent = bucketIssues.size.to_f*100 / @issues.size.to_f
			lineOut << issuesPercent

			issuesSum += issuesPercent
			lineOut << issuesSum

			bucketAlternatives = @alternatives.select{ |alternative| 
				(alternative['Activity Time'].to_i) > bucket*10*60 && 
				(alternative['Activity Time'].to_i) < (bucket+1)*10*60-1
			}
			lineOut << bucketAlternatives.size

			alternativesPercent = bucketAlternatives.size.to_f*100 / @alternatives.size.to_f
			lineOut << alternativesPercent

			alternativesSum += alternativesPercent
			lineOut << alternativesSum

			out << lineOut
		}
		return out
	end
end