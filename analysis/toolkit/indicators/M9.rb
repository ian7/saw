require_relative './indicator.rb'

class M9 < Indicator
	def header
		fields = [
			"issue count",
			"no positions",
			"colliding",
			"aligned",
		]
		fields = ["Alternaitve count","Label"] + fields.map{|x| x+" EP"} + fields.map{|x| x+" SAW"}
		return fields
	end
	def calculateBucket( lineOut, bucket, issues, alternatives )
		filteredIssues = issues.select{|x| x['Alternatives Count'] == bucket.to_s }

		lineOut << filteredIssues.size

		alternativesInNoPositions = 0
		filteredIssues.each{ |x| alternativesInNoPositions += x['Alternatives in NoPositions'].to_i }

		alternativesInAligned = 0
		filteredIssues.each{ |x| alternativesInAligned += x['Alternatives in Aligned'].to_i }

		alternativesInColliding = 0
		filteredIssues.each{ |x| alternativesInColliding += x['Alternatives in Colliding'].to_i }

		totalAlternatives = alternativesInNoPositions + alternativesInAligned + alternativesInColliding

		if totalAlternatives > 0
			lineOut << alternativesInNoPositions.to_f * 100.0 / totalAlternatives
			lineOut << alternativesInAligned.to_f * 100.0 / totalAlternatives
			lineOut << alternativesInColliding.to_f * 100.0 / totalAlternatives
		else
			lineOut << "0"
			lineOut << "0"
			lineOut << "0"
		end

	end

	def calculate
		out = []

		buckets = (1..6)


		buckets.each{ |bucket|
			lineOut = []

			
			lineOut << bucket
			lineOut << "label placeholder"
			calculateBucket( lineOut, bucket, @issues.select{|x| x.isEP}, @alternatives.select{|x| x.isEP} )
			calculateBucket( lineOut, bucket, @issues.select{|x| x.isSAW}, @alternatives.select{|x| x.isSAW} )

			lineOut[1] = "\{#{lineOut[0]}\\\\(#{lineOut[2]},#{lineOut[6]})\}"

			out << lineOut
		}
		return out
	end
end