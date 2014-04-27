require './analysis/toolkit/events.rb'
require './analysis/toolkit/items.rb'
require './analysis/toolkit/metrics.rb'
require './analysis/toolkit/indicators.rb'
require './analysis/toolkit/metricMatrix.rb'
require 'fileutils'
require 'optparse'

sourcePath = nil



rootPath = '/home/vagrant/workspace/analysis/'
outputProject = File.open rootPath+'output/aggregates-all/projects.csv','w'


outputIssues = File.open rootPath+'output/aggregates-all/issues.csv','w'

Metric.findMetricsFor(IssueLogItem).map { |metric| outputIssues.print metric.header.join("\t") + "\t" }
outputIssues.puts ""
outputAlternaitves = File.open rootPath+'output/aggregates-all/alternatives.csv','w'

Metric.findMetricsFor(AlternativeLogItem).map { |metric| outputAlternaitves.print metric.header.join("\t") + "\t" }
outputAlternaitves.puts ""
outputDecisions = File.open rootPath+'output/decisions.csv','w'

#allProjects = MetricMatrix.new
#allProjects =

allIssues = MetricMatrix.new
allIssues.setHeaders( Metric.findMetricsFor(IssueLogItem).map { |metric| metric.header } .flatten(1) )
allIssueObjects = []

allAlternaitves = MetricMatrix.new
allAlternaitves.setHeaders( Metric.findMetricsFor(AlternativeLogItem).map { |metric| metric.header } .flatten(1))
allAlternativeObjects = []

allProjectObjects = []

require './analysis/toolkit/models.rb'

#this is going through the EP

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
		nLE = LogEvent.new(line) 
		digestLog << nLE
	end

	puts 'split done'

		logIssues = IssueLogItem.find( digestLog, sourcePath.chomp(".csv") )

	puts 'found ' + logIssues.size.to_s + " issues"




	logIssues.each do |logIssue|

		logIssue.analyze(:EP)
		logIssue.to_s

		#debugger
		outputIssues.puts logIssue.status.join("\t") + "\n"
	
		allIssues << logIssue.status

		logIssue.alternatives.each{ |x| 
			allAlternaitves << x.status
			allAlternativeObjects << x

			outputAlternaitves.puts x.status.join("\t") + "\n" 
		}

	end
	projectObject = ProjectLogItem.new( sourcePath.chomp(".csv"), digestLog )
	projectObject.issues = logIssues
	allProjectObjects << projectObject

	allIssueObjects.concat logIssues
end



#=begin

Dir.foreach('./analysis/logs-digested') do |sourcePath|
	next if sourcePath == '.' or sourcePath == '..'

	# load up digested log
	#digestFile = File.open rootPath+'digest.log'
	digestFile = File.open './analysis/logs-digested/'+ sourcePath

	digestLines = digestFile.readlines
	puts 'Loaded ' + digestLines.size.to_s + ' digest lines, splitting...'

	digestLog = []
	digestLines.each { |line| digestLog << LogEvent.new( line.split(",") ) }
	digestLog.sort! { |x,y| x[1].to_i <=> y[1].to_i }

	smallestTimestamp = 9999999999


	# let's find the smallest timestamp
	digestLog.each do |line|  
		if line[1].to_i < smallestTimestamp && line[1].to_i > 0 
			smallestTimestamp = line[1].to_i
		end
	end

	puts 'smallest timestamp found to be: ' + smallestTimestamp.to_s

	sortedDigest = File.open rootPath+'digest.csv','w'

	#digestLog.each { |line| puts line[1] }
	digestLog.each do |line| 
		line[1] = (line[1].to_i - smallestTimestamp).to_s 
		sortedDigest.puts line.join("\t")
	end

	sortedDigest.close

	puts 'split done.'


	projectID = sourcePath[/\.(.*?)\./].gsub("\.","")

	project = Project.find_by_id projectID

	issues = project.related_from().select{ |x| x["type"]=="Issue"}
	#puts "Project ID: " + project.id.to_s + 
	outputProject.print "\"" + project["name"] + "\"\t" 
	outputProject.print issues.count.to_s + "\t" 

	totalDecisionCounts = []
	alternativeCount =0 

	ilms = []

	logIssues = IssueLogItem.find( digestLog, projectID )

	logIssues.each do |logIssue|
		ilm = logIssue
		ilm.analyze 
		ilm.to_s

		ilms << ilm


		collidingAlternativeCount = 0
		decidedAlternativeCount = 0
		undecidedAlternativeCount = 0

		ilm.alternativesLog.each do |la|

		
			decisionCounts=[]

			alm = AlternativeLogItem.new la, digestLog, projectID 
			alm.analyze 
			alm.to_s
			outputAlternaitves.puts alm.status.join("\t") + "\n"
			allAlternaitves << alm.status
			allAlternativeObjects << alm

			ilms << alm

			sb = alm.sbLog

			if not sb
				puts 'solvedBy not found for alternative - skipping'
				next
			end

			sbli = SolvedByLogItem.new alm.sbLog.to_id, digestLog
			sbli.analyze 
			sbli.to_s
			ilms << sbli
		end
		
		outputIssues.puts ilm.status.join("\t") + "\n"
		allIssues << ilm.status
		allIssueObjects << ilm
	end

	projectObject = ProjectLogItem.new( projectID, digestLog )
	projectObject.issues = logIssues
	allProjectObjects << projectObject
end

#=end


allIssues.save("issues.mm")
allAlternaitves.save("alternatives.mm")

allItems = allIssueObjects.clone()
allItems.concat allAlternativeObjects

allProjects = allItems.uniq{ |x| x.projectID }.map{ |x| x.projectID }

allProjectsMM = MetricMatrix.new
allProjectsMM.setHeaders( Metric.findMetricsFor(ProjectLogItem).map { |metric| metric.header } .flatten(1) )

allProjectObjects.each do |project|
	allProjectsMM << project.status
end

#debugger
allProjectsMM.save("projects.mm")


allUsers = []
allItems.each do |item|
	allUsers.concat item.events.map{ |event| event.user }.uniq
end
allUsers.uniq!

userMMs = {}
allUsers.each{|user| 
	allProjectsMM = MetricMatrix.new
	allProjectsMM.setHeaders( Metric.findMetricsFor(ProjectLogItem).map { |metric| metric.header } .flatten(1) )
	
	#userObject = UserLogItem.new user, allProjectObjects

	allProjectObjects.each do |project|
			extraFilter = Proc.new{ |e| 
				e.user==user }
			allProjectsMM << project.status( extraFilter )
		end
	allProjectsMM.save( "analysis/output/users/#{user}.csv" )
}

puts "we have: #{allUsers.size} unique users"



allUsersMM = MetricMatrix.new
allProjectsMM.setHeaders( Metric.findMetricsFor(ProjectLogItem).map { |metric| metric.header } .flatten(1) )


