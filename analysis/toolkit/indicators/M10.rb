require_relative './indicator.rb'

class M10 < Indicator
	def header
		fields = [
			"Issue count",
			"no alternatives",
			"no positions",
			"incomplete",
			"complete",
		]
		fields = ["Alternative count","Label"] + fields.map{|x| x+" EP"} + fields.map{|x| x+" SAW"}
	end
	def calculateBucket( lineOut, bucket, issues, alternatives )
		filteredIssues = issues.select{|x| x['Alternatives Count'] == bucket.to_s }

		lineOut << filteredIssues.size

		if filteredIssues.size > 0		
			lineOut << filteredIssues.select{ |x| x['Final Choice'] == "no alternatives" }.size.to_f * 100/filteredIssues.size
			lineOut << filteredIssues.select{ |x| x['Final Choice'] == "no positions" }.size.to_f * 100/filteredIssues.size
			lineOut << filteredIssues.select{ |x| x['Final Choice'] == "incomplete" }.size.to_f * 100/filteredIssues.size
			lineOut << filteredIssues.select{ |x| x['Final Choice'] == "complete" }.size.to_f * 100/filteredIssues.size
		else
			lineOut << "0"
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

			lineOut[1]="\{#{bucket.to_s}\\\\(#{lineOut[2]},#{lineOut[7]})\}"

			out << lineOut
		}

		print "EP "
		issueCategoryStats( @issues.select{|x| x.isEP} )
		puts ""
		print "SAW "
		issueCategoryStats( @issues.select{|x| x.isSAW} )
		puts
		print "total "
		issueCategoryStats( @issues )
		puts

		return out
	end
	def issueCategoryStats( list )
		print "M10: issueCounts: " + list.size.to_s + " "
		print "na: " +list.select{ |x| x['Final Choice'] == "no alternatives" }.count.to_s + " "
		print "np: " +list.select{ |x| x['Final Choice'] == "no positions" }.count.to_s + " "
		print "ic: " +list.select{ |x| x['Final Choice'] == "incomplete" }.count.to_s + " "
		print "co: " +list.select{ |x| x['Final Choice'] == "complete" }.count.to_s 
	end
end