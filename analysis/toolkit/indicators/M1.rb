require_relative './indicator.rb'



class M1 < Indicator
	def header
		fields = [
			"Project",
			"Issue Count",
			"Existing Issues",
			"Destroyed Issues",
			"EP issues",
			"SAW issues",
		]
	end
	def calculate
		out = []

		exclusions = [
			"Exercise 3",
			"Exercise 6",
		]

		#debugger

		pm = ProjectMapper.new

		issueCountsEP = []
		issueCoutnsSAW = []

		projects = @issues.uniq {|x| pm[x['Project']] } .map{|x| pm[x["Project"]] }
		projects.sort!
		projects.each{ |project|

			projectIssues = @issues.select{ |issue| pm[issue['Project']] == project }

			lineOut = []
			# project ID
			lineOut << project
			# issues total
			lineOut << projectIssues.length
			# issues existing
			lineOut << projectIssues.select{|x| x['Destroyed'] == "0"}.length
			#issues deleted
			lineOut << projectIssues.select{|x| x['Destroyed'] == "1"}.length
			# ep issues
			lineOut << projectIssues.select{|x| x["ID"].length <= 7}.length
			# SAW issues
			lineOut << projectIssues.select{|x| x["ID"].length > 7}.length

			if exclusions.find {|x| x==project}
				#do nothing
			else
				issueCountsEP << projectIssues.select{|x| x["ID"].length <= 7}.length
				issueCoutnsSAW << projectIssues.select{|x| x["ID"].length > 7}.length
				out << lineOut
			end
		}

		# EP
		#debugger
		puts "EP total: " + issueCountsEP.inject(:+).to_s + " avg: " + issueCountsEP.mean.to_s + " sd: " + issueCountsEP.standard_deviation.to_s
		puts "SAW total: " + issueCoutnsSAW.inject(:+).to_s + " avg: " + issueCoutnsSAW.mean.to_s + " sd: " + issueCoutnsSAW.standard_deviation.to_s


		return out
	end
end