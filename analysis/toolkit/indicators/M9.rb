require_relative './indicator.rb'

class M9 < Indicator
	def header
		fields = [
			"Alternative count",
			"no positions",
			"colliding",
			"aligned",
		]
	end
	def calculate
		out = []

		buckets = (1..7)


		buckets.each{ |bucket|
			lineOut = []

			filteredIssues = @issues.select{|x| x['Alternatives Count'] == bucket.to_s }
			
			lineOut << bucket

			alternativesInNoPositions = 0
			filteredIssues.each{ |x| alternativesInNoPositions += x['Alternatives in NoPositions'].to_i }

			alternativesInAligned = 0
			filteredIssues.each{ |x| alternativesInAligned += x['Alternatives in Aligned'].to_i }

			alternativesInColliding = 0
			filteredIssues.each{ |x| alternativesInColliding += x['Alternatives in Colliding'].to_i }

			totalAlternatives = alternativesInNoPositions + alternativesInAligned + alternativesInColliding

			lineOut << alternativesInNoPositions.to_f * 100 / totalAlternatives
			lineOut << alternativesInAligned.to_f * 100 / totalAlternatives
			lineOut << alternativesInColliding.to_f * 100 / totalAlternatives
			
			out << lineOut
		}
		return out
	end
end