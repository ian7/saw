require_relative './indicator.rb'

class M14 < Indicator
	def header
		fields = [
			"Number of state changes",
			"Alternaitves count",
			"Alternaitves percent",
		]
	end
	def calculate
		out = []

		buckets = (0..4)

		buckets.each{ |bucket|
			lineOut = []
			filteredAlternatives = @alternatives.select{ |x| 
				x['Consensus State Changes'].to_i == bucket &&
				x['Destroyed'] == "0"
			}
			lineOut << "#{bucket.to_s}\\\\(#{ filteredAlternatives.size })"
			lineOut << filteredAlternatives.size
			lineOut << filteredAlternatives.size.to_f * 100 / @alternatives.size

			out << lineOut
		}
		return out
	end
end