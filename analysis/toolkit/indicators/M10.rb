require_relative './indicator.rb'

class M10 < Indicator
	def header
		fields = [
			"Alternative count",
			"no alternatives",
			"no positions",
			"incomplete",
			"complete",
		]
	end
	def calculate
		out = []

		buckets = (0..7)


		buckets.each{ |bucket|
			lineOut = []

			filteredIssues = @issues.select{|x| x['Alternatives Count'] == bucket.to_s }
			
			lineOut << "\{#{bucket.to_s}\\\\(#{filteredIssues.size})\}"

			lineOut << filteredIssues.select{ |x| x['Final Choice'] == "no alternatives" }.size.to_f * 100/filteredIssues.size
			lineOut << filteredIssues.select{ |x| x['Final Choice'] == "no positions" }.size.to_f * 100/filteredIssues.size
			lineOut << filteredIssues.select{ |x| x['Final Choice'] == "incomplete" }.size.to_f * 100/filteredIssues.size
			lineOut << filteredIssues.select{ |x| x['Final Choice'] == "complete" }.size.to_f * 100/filteredIssues.size

			out << lineOut
		}
		return out
	end
end