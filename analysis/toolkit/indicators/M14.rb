require_relative './indicator.rb'

class M14 < Indicator
	def header
		fields = [
			"Alternaitves count",
			"Alternaitves percent",
		]
		fields = ["Number of state changes","Label"] + fields.map{|x| x+" EP"} + fields.map{|x| x+" SAW"}
	end
	def calculateBucket( lineOut, bucket, issues, alternatives )

		filteredAlternatives = alternatives.select{ |x| 
			x['Consensus State Changes'].to_i == bucket &&
			x['Destroyed'] == "0"
		}
		lineOut << filteredAlternatives.size
		lineOut << filteredAlternatives.size.to_f * 100 / alternatives.size

	end

	def calculate
		out = []

		buckets = (0..4)

		buckets.each{ |bucket|
			lineOut = []
			lineOut << "#{bucket.to_s}"
			lineOut << "label placeholder"

			calculateBucket( lineOut, bucket, @issues.select{|x| x.isEP}, @alternatives.select{|x| x.isEP} )
			calculateBucket( lineOut, bucket, @issues.select{|x| x.isSAW}, @alternatives.select{|x| x.isSAW} )

			lineOut[1] = "#{lineOut[0]}\\\\(#{lineOut[2]},#{lineOut[4]})"

			out << lineOut
		}
		return out
	end
end