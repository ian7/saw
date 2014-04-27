require_relative './indicator.rb'

class M13 < Indicator
	def header
		fields = [
			"Timespan bucket",
			"Last decision Issues",
			"Last decision Issues percent",
			"Last decision Issues sum",
			"Last decision Alternatives",
			"Last decision Alternatives percent",
			"Last decision Alternatives sum",
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
				#debugger
				(issue['Time since last decision'].to_i) > bucket*10*60 && 
				(issue['Time since last decision'].to_i) < (bucket+1)*10*60-1
			}
			lineOut << bucketIssues.size

			issuesPercent = bucketIssues.size.to_f*100 / @issues.size.to_f
			lineOut << issuesPercent

			issuesSum += issuesPercent
			lineOut << issuesSum

			bucketAlternatives = @alternatives.select{ |alternative| 
				(alternative['Time since last decision'].to_i) > bucket*10*60 && 
				(alternative['Time since last decision'].to_i) < (bucket+1)*10*60-1
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