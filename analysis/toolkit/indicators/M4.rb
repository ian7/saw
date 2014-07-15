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
		fields = ["label","Label Issues","Label Alternatives"]+fields.map{|x| x+" EP"} + fields.map{|x| x+" SAW"}
		return fields
	end
	def bucketStats( lineOut, bucket, issues, alternatives )


			bucketIssues = issues.select{ |issue| issue['Deciders2'].to_i == bucket }
			bucketAlternatives = alternatives.select{ |alternative| 
				alternative['Deciders2'].to_i == bucket 
				#&& alternative['Final State'] != "n/a"
			}


			lineOut << "\{#{bucket}\\\\(#{bucketIssues.length},#{bucketAlternatives.length})\}"
			lineOut << "\{#{bucket}\\\\(#{bucketIssues.length})\}"
			lineOut << "\{#{bucket}\\\\(#{bucketAlternatives.length})\}"
			lineOut << bucketIssues.length
			lineOut << bucketAlternatives.length
			
			#debugger 

			if issues.length > 0
				lineOut << bucketIssues.select{ |issue| issue['Deciders2'].to_i == bucket }.length.to_f*100/issues.length
			else
				lineOut << "0"
			end
			if alternatives.length > 0
				lineOut << bucketAlternatives.select{ |issue| issue['Deciders2'].to_i == bucket }.length.to_f*100/alternatives.length
			else
				lineOut << "0"
			end
					
			lineOut << bucketAlternatives.select{|x| x['Final State'] == "aligned"}.length
			lineOut << bucketAlternatives.select{|x| x['Final State'] == "no positions"}.length
			lineOut << bucketAlternatives.select{|x| x['Final State'] == "colliding"}.length

			if bucketAlternatives.length > 0
				lineOut << bucketAlternatives.select{|x| x['Final State'] == "aligned"}.length.to_f*100.0/bucketAlternatives.length
				lineOut << bucketAlternatives.select{|x| x['Final State'] == "no positions"}.length.to_f*100.0/bucketAlternatives.length
				lineOut << bucketAlternatives.select{|x| x['Final State'] == "colliding"}.length.to_f*100.0/bucketAlternatives.length
			else
				lineOut << "0"
				lineOut << "0"
				lineOut << "0"
			end	

			if bucketIssues.length > 0
				lineOut << bucketIssues.select{|x| x['Final Choice'] == "no alternatives"}.length.to_f*100.0/bucketIssues.length
				lineOut << bucketIssues.select{|x| x['Final Choice'] == "no positions"}.length.to_f*100.0/bucketIssues.length
				lineOut << bucketIssues.select{|x| x['Final Choice'] == "incomplete"}.length.to_f*100.0/bucketIssues.length
				lineOut << bucketIssues.select{|x| x['Final Choice'] == "complete"}.length.to_f*100.0/bucketIssues.length
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


			lineOutEP = []
			lineOutSAW = []

			bucketStats( lineOutEP, bucket, @issues.select{|x| x.isEP}, @alternatives.select{|x| x.isEP} );
			bucketStats( lineOutSAW, bucket, @issues.select{|x| x.isSAW}, @alternatives.select{|x| x.isSAW} );

			#debugger

			#label = "\{#{bucket}\\\\(#{@issues.select{|x| x.isEP}.length},#{@issues.select{|x| x.isSAW}.length},#{@alternatives.select{|x| x.isEP}},#{@alternatives.select{|x| x.isSAW}})\}"
			label ="\{#{bucket}\\\\(#{lineOutEP[3]},#{lineOutEP[4]},\\\\#{lineOutSAW[3]},#{lineOutSAW[4]})\}"
			labelIssues = "\{#{bucket}\\\\(#{lineOutEP[3]},#{lineOutSAW[3]})\}"
			labelAlternatives = "\{#{bucket}\\\\(#{lineOutEP[4]},#{lineOutSAW[4]})\}"
			out << [label, labelIssues, labelAlternatives] + lineOutEP + lineOutSAW

		
			#out << lineOut
		}
		return out
	end
end