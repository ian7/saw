require 'fileutils'
require 'optparse'


system 'ruby ./analysis/decompose.rb'

system 'rails runner analysis/project_stats.rb'
system 'rails runner analysis/ep_stats.rb'


# let's clean up a bit
#FileUtils.rm_rf(Dir.glob('./analysis/output/*.item'))
#FileUtils.rm_rf(Dir.glob('./analysis/output/*.full'))
FileUtils.rm_rf(Dir.glob('./analysis/output/aggregates-all/*.csv'))

#fileNames = ['alternatives','issues','projects']
fileNames = ['alternatives','issues']

pathBase = './analysis/output/'

aggregateTypes = ["ep","saw"]

fileNames.each do |fileName|

	outputFileName = pathBase + "aggregates-" + "all" + "/" + fileName + ".csv"	
	outputFile = File.open outputFileName, 'w'

	headerSet = false

	aggregateTypes.each do |aggregateType|

		completeFileName = pathBase + "aggregates-" + aggregateType + "/" + fileName + ".csv"

		inputFile = File.open completeFileName,'r'

		inputLines = inputFile.readlines.map{ |x| x.split("\t") }

		#debugger 
		if headerSet == false
			outputFile.puts "source\t" + inputLines.first.join("\t")
			headerSet = true
		end

		firstLine = true
		inputLines.each do |line| 
			if firstLine  == true
				firstLine = false
				puts 'skipping header'
			else
				outputFile.puts aggregateType + "\t" + line.join("\t")
			end
		end
	end
	outputFile.close
end

