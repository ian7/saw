require_relative './indicator.rb'

class M4 < Indicator
	def header
		fields = [
			"Contributors count",
			"Alternaitves",
			"aligned",
			"no positions",
			"colliding",
			"aligned percent",
			"no positions percent",
			"colliding percent"
		]
	end
	def calculate
		out = []

		buckets = (0..10)

		buckets.each{ |bucket|
			lineOut = []
			alternativesInBucket = @alternatives.select{ |issue| issue['Contributors'].to_i == bucket }

			lineOut << bucket
			lineOut << alternativesInBucket.length
			lineOut << alternativesInBucket.select{|x| x['Final State'] == "aligned"}.length
			lineOut << alternativesInBucket.select{|x| x['Final State'] == "no positions"}.length
			lineOut << alternativesInBucket.select{|x| x['Final State'] == "colliding"}.length

			if alternativesInBucket.length > 0
				lineOut << alternativesInBucket.select{|x| x['Final State'] == "aligned"}.length*100/alternativesInBucket.length
				lineOut << alternativesInBucket.select{|x| x['Final State'] == "no positions"}.length*100/alternativesInBucket.length
				lineOut << alternativesInBucket.select{|x| x['Final State'] == "colliding"}.length*100/alternativesInBucket.length
			else
				lineOut << "0"
				lineOut << "0"
				lineOut << "0"
			end				
			out << lineOut

		}
		return out
	end
end