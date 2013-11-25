

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

require './analysis/toolkit/indicators.rb'
require './analysis/toolkit/metricMatrix.rb'

outputPath = "./analysis/output/"

allProjects = MetricMatrix.new

allIssues = MetricMatrix.new
allIssues.load("issues.mm")

allAlternatives = MetricMatrix.new
allAlternatives.load("alternatives.mm")

Indicator.subclasses.each { |indicator|
	i = indicator.new( allProjects, allIssues, allAlternatives)
	puts i.class.to_s

	outputFile = File.open outputPath + i.class.to_s + ".csv","w"

	outputFile.write i.header.join("\t") + "\n"

	i.calculate.each{ |line| outputFile.write( line.join("\t") + "\n" )}

	#puts i.calculate.to_s
}
