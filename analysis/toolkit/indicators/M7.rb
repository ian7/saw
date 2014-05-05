require_relative './indicator.rb'

class M7 < Indicator
	def header
		fields = [
			"Alternatives total",
			"Positive decisions",
			"Positive revoked decisions",
			"Negative decisions",
			"Negative revoked decisions",
			"Open decisions",
			"Open revoked decisions",
			"Any decisions",
		]
		fields = ["Count bucket"] + fields.map{|x| x+" EP"} + fields.map{|x| x+" SAW"}
	end
	
	def calculateBucket( lineOut, bucket, issues, alternatives )
			lineOut << alternatives.size
			lineOut << alternatives.select{ |x| x['Positive'].to_i == bucket }.size*100/alternatives.size
			lineOut << alternatives.select{ |x| x['PositiveRevoked'].to_i == bucket }.size*100/alternatives.size
			lineOut << alternatives.select{ |x| x['Negative'].to_i == bucket }.size*100/alternatives.size
			lineOut << alternatives.select{ |x| x['NegativeRevoked'].to_i == bucket }.size*100/alternatives.size
			lineOut << alternatives.select{ |x| x['Open'].to_i == bucket }.size*100/alternatives.size
			lineOut << alternatives.select{ |x| x['OpenRevoked'].to_i == bucket }.size*100/alternatives.size
			lineOut << alternatives.select{ |x| x['Position Count'].to_i == bucket }.size*100/alternatives.size
	
	end

	def calculate
		out = []

		buckets = (0..8)

		issuesSum = 0.0
		alternativesSum = 0.0

		buckets.each{ |bucket|
			lineOut = []
			lineOut << bucket
			calculateBucket( lineOut, bucket, @issues.select{|x| x.isEP}, @alternatives.select{|x| x.isEP})
			calculateBucket( lineOut, bucket, @issues.select{|x| x.isSAW}, @alternatives.select{|x| x.isSAW})


			out << lineOut
		}
		return out
	end
end