require './analysis/toolkit/events.rb'
require './analysis/toolkit/items.rb'
require './analysis/toolkit/metrics.rb'
require 'fileutils'
require 'optparse'

sourcePath = nil




rootPath = '/home/vagrant/workspace/analysis/'

outputProject = File.open rootPath+'output/aggregates-ep/projects.csv','w'

outputIssues = File.open rootPath+'output/aggregates-ep/issues.csv','w'
Metric.findMetricsFor(IssueLogItem).map { |metric| outputIssues.print metric.header + "\t" }
outputIssues.puts ""

outputAlternaitves = File.open rootPath+'output/aggregates-ep/alternatives.csv','w'

Metric.findMetricsFor(AlternativeLogItem).map { |metric| outputAlternaitves.print metric.header + "\t" }
outputAlternaitves.puts ""

outputDecisions = File.open rootPath+'output/decisions.csv','w'

require './analysis/toolkit/models.rb'

#sourcePath = './analysis/excel-ep/ex7.csv'




Dir.foreach('./analysis/excel-ep') do |sourcePath|
	next if sourcePath == '.' or sourcePath == '..'

	puts "analyzing: #{sourcePath}"

	projectName = sourcePath[0..sourcePath.length-5]

	sourceFile = File.open "./analysis/excel-ep/"+sourcePath
	sourceLines = sourceFile.readlines


	puts 'read ' + sourceLines.size.to_s

	lineCount = 0
	digestLog = []

	sourceLines.each do |sourceLine|
		splitSourceLine = sourceLine.split "\t"
	#	puts splitSourceLine.to_s
		# let's skip the headers
		lineCount = lineCount + 1
		if lineCount == 1
			next
		end
		#declare new line
		line = Array.new( 13, "" )

		# item id
		line[8] = splitSourceLine[4]
		# time
		line[1] = splitSourceLine[1]
		# user
		line[2] = splitSourceLine[6]
		# action 
		line[6] = splitSourceLine[5]
		line[7] = splitSourceLine[5]
		# to_id (this carries a decision too)
		line[9] = splitSourceLine[4]
		#line[8] = splitSourceLine[7]
		# itemType
		line[11] = splitSourceLine[3]
		# distance
		line[10] = '0'
		# payload
		line[12] = splitSourceLine[8]
		#lame param passed in the server response time fiel
		line[4] = splitSourceLine[7]
	#debugger
	#	le = LogEvent.new , line
	#	debugger
		#and dump it in the digestLog
		nLE = LogEvent.new(line) 
		digestLog << nLE
	end

	puts 'split done'

		logIssues = IssueLogItem.find( digestLog, sourcePath.chomp(".csv") )

	puts 'found ' + logIssues.size.to_s + " issues"




	logIssues.each do |logIssue|

		logIssue.analyze(:EP)
		logIssue.to_s

		outputIssues.puts logIssue.status.each{ |x| x.to_s }.join "\t" + "\n"

		logIssue.alternatives.each{ |x| outputAlternaitves.puts x.status }
	end
end



