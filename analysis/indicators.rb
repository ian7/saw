

# it looks like this exists only in rails
class Class
 def inherited other
   super if defined? super
 ensure
   ( @subclasses ||= [] ).push(other).uniq!
 end

 def subclasses
   @subclasses ||= []
   @subclasses.inject( [] ) do |list, subclass|
     list.push(subclass, *subclass.subclasses)
   end
 end
end


class ProjectMapper
	def initialize
		@projects = {
			"ex4" => "Run 1",
			"ex5" => "Run 2",
			"ex6" => "Exercise 6",
			"ex7" => "Run 3",
			"ex8" => "Run 4",
			"ex9" => "Run 5",
			"517652dfda300c1675000001" => "Exercise 3",
			"51765a68da300c1849000001" => "Run 1",
			"5187d355da300c37f7000001" => "Run 2",
			"518a833eda300c484c000001" => "Exercise 6",
			"51925958da300c697d000001" => "Run 3",
			"5193a637da300c3002000001" => "Run 4",
			"519a3a22da300c3793000001" => "Run 5"
		}

		@exclusions = [
			"Exercise 3",
			"Exercise 6",
		]

=begin
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
=end
	end
	def [](id)
		value = @projects.find { |key, value| key == id}
		if value
			return value[1]
		else
			return ""
		end
	end
	def isExcluded( projectId )
		@exclusions.index(self[projectId])
	end
end




require './analysis/toolkit/indicators.rb'
require './analysis/toolkit/metricMatrix.rb'

outputPath = "./analysis/output/"

pm = ProjectMapper.new
allProjects = MetricMatrix.new

allIssues = MetricMatrix.new
allIssues.load("issues.mm")
allIssues = allIssues.select{ |issue| !pm.isExcluded(issue["Project"] ) }.select{|issue| issue["Destroyed"] == "0"}


allAlternatives = MetricMatrix.new
allAlternatives.load("alternatives.mm")
allAlternatives = allAlternatives.select{ |issue| !pm.isExcluded(issue["Project"] ) }.select{|issue| issue["Destroyed"] == "0"}

#debugger

Indicator.subclasses.each { |indicator|
	i = indicator.new( allProjects, allIssues, allAlternatives)
	puts i.class.to_s

	outputFile = File.open outputPath + i.class.to_s + ".csv","w"

	outputFile.write i.header.join("\t") + "\n"

	i.calculate.each{ |line| outputFile.write( line.join("\t") + "\n" )}

	#puts i.calculate.to_s
}
