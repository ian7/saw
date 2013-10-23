require './analysis/toolkit/events.rb'
require './analysis/toolkit/items.rb'
require './analysis/toolkit/metrics.rb'
require 'fileutils'
require 'optparse'

sourcePath = nil


# let's clean up a bit
FileUtils.rm_rf(Dir.glob('./analysis/output/*.item'))
FileUtils.rm_rf(Dir.glob('./analysis/output/*.full'))

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
		digestLog << LogEvent.new(line) 
	end

	puts 'split done'

		logIssues = IssueLogItem.find( digestLog, sourcePath.chomp(".csv") )

	puts 'found ' + logIssues.size.to_s + " issues"

	logIssues.each do |logIssue|

		logIssue.analyze(:EP)
		logIssue.to_s
		outputIssues.puts logIssue.status


		logIssue.alternatives.each{ |x| outputAlternaitves.puts x.status }
	end
end



=begin
#allProjects.each do |project|

	# some project
	#project = Project.find_by_id '516d4176da300c2ae7000001'
	# ex3
	#project = Project.find_by_id '517652dfda300c1675000001'
	# ex4
	project = Project.find_by_id '51765a68da300c1849000001'

	issues = project.related_from().select{ |x| x["type"]=="Issue"}
	#puts "Project ID: " + project.id.to_s + 
	outputProject.print "\"" + project["name"] + "\"\t" 
	outputProject.print issues.count.to_s + "\t" 

	totalDecisionCounts = []
	alternativeCount =0 

	ilms = []

	logIssues = IssueLogItem.find( digestLog )

	logIssues.each do |logIssue|
#	issues.each do |issue|

		ilm = logIssue
		#ilm = IssueLogItem.new issue.id.to_s, digestLog 
		ilm.analyze 
		ilm.to_s outputIssues

		ilms << ilm


		#outputIssues.print issue.id.to_s + "\t " + issue['name'].to_s
		#alternatives = issue.related_to "SolvedBy"
		
		#alternativeCount += alternatives.count

		# let's find how many entries do we have in the log for it
		# => logEvents = digestLog.select { |line| line[9] == issue.id.to_s }
		
		#puts 'issue ' + issue.id.to_s + ' has ' + logEvents.size.to_s + ' log entries'

		#puts logEvents.select { |line| line[5] == 'GET' }.count.to_s + ' GETs'
		#puts logEvents.select { |line| line[5] == 'PUT' }.count.to_s + ' PUTs'
		#puts logEvents.select { |line| line[5] == 'POST' }.count.to_s + ' POSTs'

		#outputIssues.print "\t" + alternatives.count.to_s

		collidingAlternativeCount = 0
		decidedAlternativeCount = 0
		undecidedAlternativeCount = 0

		ilm.alternativesLog.each do |la|

		#alternatives.each do |alternative|
		
			decisionCounts=[]

			alm = AlternativeLogItem.new la, digestLog 
			alm.analyze 
			alm.to_s
			ilms << alm

			#sb = alternative.relations_from("SolvedBy").first

			sb = alm.sbLog

			if not sb
				puts 'solvedBy not found for alternative - skipping'
				next
			end

			sbli = SolvedByLogItem.new alm.sbLog.to_id, digestLog 
			sbli.analyze 
			sbli.to_s
			ilms << sbli
#			debugger

			sb.relations_to.each do |decisionTagging|
				#puts decisionTagging.id
				#puts decisionTagging.origin
				decisionIndex = decisionTags.to_a.index{ |x| x.id == decisionTagging.origin }
	

				if decisionIndex then
					decision = decisionTags[decisionIndex]

					if decisionCounts[decisionIndex] then
						decisionCounts[decisionIndex] = decisionCounts[decisionIndex] + 1 					
					else
						decisionCounts[decisionIndex] = 1
					end
				end
			end

			outputAlternaitves.print alternative.id.to_s + "\t" + alternative['name'].to_s + "\t"

			(0..2).each do |decisionIndex|
				totalDecisionCounts[decisionIndex] = totalDecisionCounts[decisionIndex].to_i + decisionCounts[decisionIndex].to_i
				if decisionCounts[decisionIndex]
					outputAlternaitves.print  decisionCounts[decisionIndex].to_s + "\t"
				else
					outputAlternaitves.print  "0\t"
				end

			end



			if is_colliding( sb, project ) then
				outputAlternaitves.print 'colliding'
				collidingAlternativeCount = collidingAlternativeCount + 1
			else
				decision = get_decision( sb, project )
				if decision then 
					outputAlternaitves.print decision['name']
					decidedAlternativeCount = decidedAlternativeCount + 1
				else
					outputAlternaitves.print 'undecided'
					undecidedAlternativeCount = undecidedAlternativeCount + 1
				end
			end
			outputAlternaitves.puts ''

				#decisionTags = alternative.related_to().select{ |x| x["type"]=="Decision"}
		end
		outputIssues.print "\t" + decidedAlternativeCount.to_s + "\t" + collidingAlternativeCount.to_s + "\t" + undecidedAlternativeCount.to_s
		outputIssues.puts ''

		# finished dumping issue details
		



	end

	outputProject.print alternativeCount.to_s + "\t"
	(0..2).each do |decisionIndex|
		if totalDecisionCounts[decisionIndex]
			outputProject.print totalDecisionCounts[decisionIndex].to_i.to_s + "\t"
		else
			outputProject.print "0\t"
		end
	end
	outputProject.puts ""
	puts 'Project: ' + project['name'] + ' processed'


	ilms.each do |lm|

	end

#	break
#end
=end
