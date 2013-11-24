require './analysis/toolkit/events.rb'
require './analysis/toolkit/items.rb'
require './analysis/toolkit/metrics.rb'



decisionTags = Taggable.find :all, :conditions=>{:type=>"Decision"}


allIssues = Taggable.find :all, :conditions=>{:type=>"Issue"}
allProjects = Taggable.find :all, :conditions=>{:type=>"Project"}

rootPath = '/home/vagrant/workspace/analysis/'

outputProject = File.open rootPath+'output/aggregates-saw/projects.csv','w'

outputIssues = File.open rootPath+'output/aggregates-saw/issues.csv','w'


# let's dump some headers 

Metric.findMetricsFor(IssueLogItem).map { |metric| outputIssues.print metric.header + "\t" }
outputIssues.puts ""

outputAlternaitves = File.open rootPath+'output/aggregates-saw/alternatives.csv','w'

Metric.findMetricsFor(AlternativeLogItem).map { |metric| outputAlternaitves.print metric.header + "\t" }
outputAlternaitves.puts ""

outputDecisions = File.open rootPath+'output/decisions.csv','w'

require './analysis/toolkit/models.rb'



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

#allProjects.each do |project|

	# some project
	#project = Project.find_by_id '516d4176da300c2ae7000001'
	# ex3
	#project = Project.find_by_id '517652dfda300c1675000001'
	# ex4
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
			outputAlternaitves.puts alm.status
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
		
		outputIssues.puts ilm.status

	end
end

