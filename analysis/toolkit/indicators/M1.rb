require_relative './indicator.rb'

class ProjectMapper
	def initialize
		@projects = {
			"ex4" => "Exercise 4",
			"ex5" => "Exercise 5",
			"ex6" => "Exercise 6",
			"ex7" => "Exercise 7",
			"ex8" => "Exercise 8",
			"ex9" => "Exercise 9",
			"517652dfda300c1675000001" => "Exercise 3",
			"51765a68da300c1849000001" => "Exercise 4",
			"5187d355da300c37f7000001" => "Exercise 5",
			"518a833eda300c484c000001" => "Exercise 6",
			"51925958da300c697d000001" => "Exercise 7",
			"5193a637da300c3002000001" => "Exercise 8",
			"519a3a22da300c3793000001" => "Exercise 9"
		}
	end
	def [](id)
		value = @projects.find { |key, value| key == id}
		if value
			return value[1]
		else
			return ""
		end
	end
end


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
				out << lineOut
			end
		}
		return out
	end
end