require_relative './indicator.rb'

class M4 < Indicator
	def header
		fields = [
			"Contributors count",
			"Contributors issues",
			"Contributors alternaitves",
			"Issues",
			"Alternaitves",
			"Issues percent",
			"Alternaitves percent",
			"aligned",
			"no positions",
			"colliding",
			"aligned percent",
			"no positions percent",
			"colliding percent",
			"no alternatives percent",
			"i no positions percent",
			"incomplete percent",
			"complete percent"
		]
	end
	def calculate
		out = []

		buckets = (1..7)


		buckets.each{ |bucket|
			lineOut = []

			bucketIssues = @issues.select{ |issue| issue['Deciders2'].to_i == bucket }
			bucketAlternatives = @alternatives.select{ |alternative| 
				alternative['Contributors'].to_i == bucket &&
				alternative['Final State'] != "n/a"
			}

			lineOut << "\{#{bucket}\\\\(#{bucketIssues.length},#{bucketAlternatives.length})\}"
			lineOut << "\{#{bucket}\\\\(#{bucketIssues.length})\}"
			lineOut << "\{#{bucket}\\\\(#{bucketAlternatives.length})\}"
			lineOut << bucketIssues.length
			lineOut << bucketAlternatives.length
			lineOut << @issues.select{ |issue| issue['Contributors'].to_i == bucket }.length*100/@issues.length
			lineOut << @alternatives.select{ |issue| issue['Contributors'].to_i == bucket }.length*100/@alternatives.length
			
			lineOut << bucketAlternatives.select{|x| x['Final State'] == "aligned"}.length
			lineOut << bucketAlternatives.select{|x| x['Final State'] == "no positions"}.length
			lineOut << bucketAlternatives.select{|x| x['Final State'] == "colliding"}.length

			if bucketAlternatives.length > 0
				lineOut << bucketAlternatives.select{|x| x['Final State'] == "aligned"}.length.to_f*100/bucketAlternatives.length
				lineOut << bucketAlternatives.select{|x| x['Final State'] == "no positions"}.length.to_f*100/bucketAlternatives.length
				lineOut << bucketAlternatives.select{|x| x['Final State'] == "colliding"}.length.to_f*100/bucketAlternatives.length
			else
				lineOut << "0"
				lineOut << "0"
				lineOut << "0"
			end	


			lineOut << bucketIssues.select{|x| x['Final Choice'] == "no alternatives"}.length.to_f*100/bucketIssues.length
			lineOut << bucketIssues.select{|x| x['Final Choice'] == "no positions"}.length.to_f*100/bucketIssues.length
			lineOut << bucketIssues.select{|x| x['Final Choice'] == "incomplete"}.length.to_f*100/bucketIssues.length
			lineOut << bucketIssues.select{|x| x['Final Choice'] == "complete"}.length.to_f*100/bucketIssues.length

			out << lineOut
		}
		return out
	end
end