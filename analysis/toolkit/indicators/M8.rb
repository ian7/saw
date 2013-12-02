require_relative './indicator.rb'

class M8 < Indicator
	def header
		fields = [
			"Decision count",
			"no positions",
			"colliding",
			"aligned",
		]
	end
	def calculate
		out = []

		buckets = (0..7)


		buckets.each{ |bucket|
			lineOut = []

			filteredAlternatives = @alternatives.select{|x| x['Compacted Position Count'] == bucket.to_s }
			
			lineOut << bucket
			noPositionsCount = filteredAlternatives.select{ |x| x['Final State'] == "no positions"}.size + 
							   filteredAlternatives.select{ |x| x['Final State'] == "n/a"}.size
			lineOut << noPositionsCount*100/filteredAlternatives.size
			lineOut << filteredAlternatives.select{ |x| x['Final State'] == "colliding"}.size*100/filteredAlternatives.size
			lineOut << filteredAlternatives.select{ |x| x['Final State'] == "aligned"}.size*100/filteredAlternatives.size

			out << lineOut
		}
		return out
	end
end