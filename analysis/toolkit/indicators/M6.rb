require_relative './indicator.rb'

class M6 < Indicator
	def header
		fields = [
			"Last change Issues",
			"Last change Issues percent",
			"Last change Issues sum",
			"Last change Alternatives",
			"Last change Alternatives percent",
			"Last change Alternatives sum",
		]
		fields = ["Timespan bucket"] + fields.map{|x| x+" EP"} + fields.map{|x| x+" SAW"}
	end

	def calculateBucket( lineOut, bucket, issues, alternatives )

		issuesSum = 0.0
		alternativesSum = 0.0


			bucketIssues = issues.select{ |issue| 
				(issue['LastChange'].to_i) > bucket*10*60 && 
				(issue['LastChange'].to_i) < (bucket+1)*10*60-1
			}
			lineOut << bucketIssues.size

			issuesPercent = bucketIssues.size.to_f*100 / issues.size.to_f
			lineOut << issuesPercent

			issuesSum += issuesPercent
			lineOut << issuesSum

			bucketAlternatives = alternatives.select{ |alternative| 
				(alternative['LastChange'].to_i) > bucket*10*60 && 
				(alternative['LastChange'].to_i) < (bucket+1)*10*60-1
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


		buckets.each{ |bucket|
			lineOut = []

			lineOut << "#{(bucket*10)} -- #{((bucket+1)*10 - 1)}"

			calculateBucket( lineOut, bucket, @issues.select{|x| x.isEP}, @alternatives.select{|x| x.isEP})
			calculateBucket( lineOut, bucket, @issues.select{|x| x.isSAW}, @alternatives.select{|x| x.isSAW})

			#bucketMinutes = bucket*10


			out << lineOut
		}
		return out
	end
end