require_relative './indicator.rb'

class M3 < Indicator
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
		#nasty hacked with label
		fields = ["label","Label Issues","Label Alternatives"]+fields.map{|x| x+" EP"} + fields.map{|x| x+" SAW"}
		#fields = fields.map{|x| x+" EP"} + fields.map{|x| x+" SAW"}
		return fields
	end

	def bucketStats( lineOut, bucket, issues, alternatives )


		bucketIssues = issues.select{ |issue| issue['Contributors'].to_i == bucket }
		bucketAlternatives = alternatives.select{ |alternative| 
			alternative['Contributors'].to_i == bucket &&
			alternative['Final State'] != "n/a"
		}

		lineOut << "\{#{bucket}\\\\(#{bucketIssues.length},#{bucketAlternatives.length})\}"
		lineOut << "#{bucketIssues.length}"
		lineOut << "#{bucketAlternatives.length}"
		lineOut << bucketIssues.length
		lineOut << bucketAlternatives.length
		if bucketIssues.length > 0
			lineOut << bucketIssues.select{ |issue| issue['Contributors'].to_i == bucket }.length*100/issues.length
		else
			lineOut << "0"
		end
		if bucketAlternatives.length > 0
			lineOut << bucketAlternatives.select{ |issue| issue['Contributors'].to_i == bucket }.length*100/alternatives.length
		else
			lineOut << "0"
		end
		
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

	end

	def calculate
		out = []

		buckets = (1..7)


		buckets.each{ |bucket|
			lineOut = []


			lineOutEP = []
			lineOutSAW = []

			bucketStats( lineOutEP, bucket, @issues.select{|x| x.isEP}, @alternatives.select{|x| x.isEP} );
			bucketStats( lineOutSAW, bucket, @issues.select{|x| x.isSAW}, @alternatives.select{|x| x.isSAW} );
	#		debugger
			#label = "\{#{bucket}\\\\(#{@issues.select{|x| x.isEP}.length},#{@issues.select{|x| x.isSAW}.length},#{@alternatives.select{|x| x.isEP}},#{@alternatives.select{|x| x.isSAW}})\}"
			label ="\{#{bucket}\\\\(#{lineOutEP[1]},#{lineOutSAW[1]},\\\\#{lineOutEP[2]},#{lineOutSAW[2]})\}"
			labelIssues = "\{#{bucket}\\\\(#{lineOutEP[1]},#{lineOutSAW[1]})\}"
			labelAlternatives = "\{#{bucket}\\\\(#{lineOutEP[2]},#{lineOutSAW[2]})\}"
			out << [label, labelIssues, labelAlternatives] + lineOutEP + lineOutSAW
		}

		puts "EP issues contrib avg: " + @issues.select{|x| x.isEP}.map{ |x| x['Contributors'].to_i }.mean.to_s
		puts "EP issues contrib median: " + @issues.select{|x| x.isEP}.map{ |x| x['Contributors'].to_i }.median.to_s
		puts "EP issues contrib sd: " + @issues.select{|x| x.isEP}.map{ |x| x['Contributors'].to_i }.standard_deviation.to_s
		puts "SAW issues contrib avg: " + @issues.select{|x| x.isSAW}.map{ |x| x['Contributors'].to_i }.mean.to_s
		puts "SAW issues contrib median: " + @issues.select{|x| x.isSAW}.map{ |x| x['Contributors'].to_i }.median.to_s
		puts "SAW issues contrib sd: " + @issues.select{|x| x.isSAW}.map{ |x| x['Contributors'].to_i }.standard_deviation.to_s

		puts "EP alternatives contrib avg: " + @alternatives.select{|x| x.isEP}.map{ |x| x['Contributors'].to_i }.mean.to_s
		puts "EP alternatives contrib median: " + @alternatives.select{|x| x.isEP}.map{ |x| x['Contributors'].to_i }.median.to_s
		puts "EP alternatives contrib sd: " + @alternatives.select{|x| x.isEP}.map{ |x| x['Contributors'].to_i }.standard_deviation.to_s
		puts "SAW alternatives contrib avg: " + @alternatives.select{|x| x.isSAW}.map{ |x| x['Contributors'].to_i }.mean.to_s
		puts "SAW alternatives contrib avg: " + @alternatives.select{|x| x.isSAW}.map{ |x| x['Contributors'].to_i }.median.to_s
		puts "SAW alternatives contrib sd: " + @alternatives.select{|x| x.isSAW}.map{ |x| x['Contributors'].to_i }.standard_deviation.to_s

		return out

	end
end