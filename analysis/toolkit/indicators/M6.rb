require_relative './indicator.rb'

class M6 < Indicator
	def header
		fields = [
			"Timespan bucket",
			"Last change Issues",
			"Last change Issues percent",
			"Last change Issues sum",
			"Last change Alternatives",
			"Last change Alternatives percent",
			"Last change Alternatives sum",
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
				(issue['LastChange'].to_i) > bucket*10*60 && 
				(issue['LastChange'].to_i) < (bucket+1)*10*60-1
			}
			lineOut << bucketIssues.size

			issuesPercent = bucketIssues.size.to_f*100 / @issues.size.to_f
			lineOut << issuesPercent

			issuesSum += issuesPercent
			lineOut << issuesSum

			bucketAlternatives = @alternatives.select{ |alternative| 
				(alternative['LastChange'].to_i) > bucket*10*60 && 
				(alternative['LastChange'].to_i) < (bucket+1)*10*60-1
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