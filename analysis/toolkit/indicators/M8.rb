require_relative './indicator.rb'

class M8 < Indicator
	def header
		fields = [
			"alternatives count",
			"no positions",
			"colliding",
			"aligned",
		]
		fields = ["Decision count","Label"] + fields.map{|x| x+" EP"} + fields.map{|x| x+" SAW"}

	end
	def calculateBucket( lineOut, bucket, issues, alternatives )
			filteredAlternatives = alternatives.select{|x| x['Compacted Position Count'] == bucket.to_s }
			
			lineOut << filteredAlternatives.size

			noPositionsCount = filteredAlternatives.select{ |x| x['Final State'] == "no positions"}.size + 
							   filteredAlternatives.select{ |x| x['Final State'] == "n/a"}.size
			if filteredAlternatives.size > 0
				lineOut << noPositionsCount*100.0/filteredAlternatives.size
				lineOut << filteredAlternatives.select{ |x| x['Final State'] == "colliding"}.size*100.0/filteredAlternatives.size
				lineOut << filteredAlternatives.select{ |x| x['Final State'] == "aligned"}.size*100.0/filteredAlternatives.size
			else
				lineOut << "0"
				lineOut << "0"
				lineOut << "0"
			end
	end

	def calculate
		out = []

		buckets = (0..7)


		buckets.each{ |bucket|
			lineOut = []
			lineOut << bucket
			lineOut << "label placeholder"
			calculateBucket( lineOut, bucket, @issues.select{|x| x.isEP}, @alternatives.select{|x| x.isEP} )
			calculateBucket( lineOut, bucket, @issues.select{|x| x.isSAW}, @alternatives.select{|x| x.isSAW} )

			lineOut[1] = "\{#{lineOut[0]}\\\\(#{lineOut[2]},#{lineOut[6]})\}"
			out << lineOut
		}

		print "EP "
		alternativeCategoryStats( @alternatives.select{|x| x.isEP} )
		puts ""
		print "SAW "
		alternativeCategoryStats( @alternatives.select{|x| x.isSAW} )
		puts
		print "total "
		alternativeCategoryStats( @alternatives )
		puts


		return out
	end
	def alternativeCategoryStats( list )
		print "M8: alternative Counts: " + list.size.to_s + " "
		print "np: " +list.select{ |x| x['Final State'] == "no positions" }.count.to_s + " "
		print "co: " +list.select{ |x| x['Final State'] == "colliding" }.count.to_s + " "
		print "al: " +list.select{ |x| x['Final State'] == "aligned" }.count.to_s 
	end


end