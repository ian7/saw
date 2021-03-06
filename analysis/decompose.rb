#!/usr/bin/ruby
#
require 'date'

def dig_param( request, param )

	if v = (/\"#{param}\"=>.*(?=)\"/).match(request)
		v = v.to_s[5+param.length,24]
	else
		v = '(no)'
	end
	return v
end


baseDirectory = "/home/vagrant/workspace/analysis/"


Dir.foreach( baseDirectory+'logs-unweaved') do |inputFileName|

	#this is going to filter out all the non .log files
	if not inputFileName.match /\.log$/
		next
	end

	puts "Digging through: #{inputFileName}"

	#next

	f=File.new baseDirectory+'logs-unweaved/'+inputFileName
	s = f.read
	f.close

	o=File.new baseDirectory + "logs-digested/" + inputFileName ,'w'
	o.puts "ip, timestamp, username, req_time, view_time, command, controller, action,item_id, id, taggable_id, from_taggable_id,parameters"
	#o.puts "p(1), ip(2), timestamp(3), username(4), req_time(5), view_time(6), command(7), controller(8), action(9),item_id(10), id(11), "


	s.split("Started").each do |c|

	# this logs tabular output to the 


		if ip = (/([0-9]{1,3}\.){3}[0-9]{1,3}/).match(c)
			o.print ip.to_s+","
		else
			o.print "(no),"
		end

		if timestamp = (/2013.*(?= \+0000)/).match(c)
			o.print DateTime.parse(timestamp.to_s).to_time.to_i.to_s + ","
		else
			o.print "(no),"		
		end 

		if username = (/Username\: .*/).match(c)
			username = username.to_s[10..username.to_s.length]
			o.print username.to_s+","
		else
			o.print "(no),"				
		end

		if req_time = (/[0-9]*(?=ms \()/).match(c)
			o.print req_time.to_s+","
		else
			o.print "(no),"						
		end

		if view_time = (/[0-9\.]+(?=ms\))/).match(c)
			o.print view_time.to_s+","
		else
			o.print "(no),"						
		end

		# controller
		if h = (/^.*(?= \")/).match(c)
			h = h.to_s[1,h.to_s.length]+","
			o.print h
		else
			o.print "(no),"
		end

		# action
		if action = (/Processing by .*(?= as)/).match(c)
			action = action.to_s[14,action.to_s.length]
			aa=action.split("#")
			o.print aa[0]+","+aa[1]+","
		else
			o.print "(no),(no)"+','								
		end


=begin
		if item_id = (/item_id.*(?=\",)/).match(c)
			item_id = item_id.to_s[11,item_id.to_s.length]
			#puts item_id
			#aa=action.split("#")
			o.print item_id
		else
			o.print "(no)"								
		end
=end

		o.print dig_param( c, 'item_id')+","

		o.print dig_param( c, 'id')+","
		if dig_param( c, 'taggable_id') == '(no)'
			o.print dig_param( c, 'to_taggable_id')+","
		else
			o.print dig_param( c, 'taggable_id')+","
		end
		o.print dig_param( c, 'from_taggable_id')+","
		o.print dig_param( c, 'type')+','


		if paramters = (/Parameters\:\ \{.*\}/).match(c)
#			debugger
			o.print paramters.to_s.match(/\{.*\}/).to_s.gsub(",",";").gsub("=>",":") + ","
		else
			o.print "(no),"				
		end

		o.puts ""


		# and then let's run for the notifications
		notifications = c.scan /Notifying.*\n/

		if notifications.size > 0 
			puts 'Found: ' + notifications.size.to_s + ' notifications'
		end

		notifications.each do |notificationLine|
			notificationArray = notificationLine.split " "
			o.print ip.to_s+","
			o.print DateTime.parse(timestamp.to_s).to_time.to_i.to_s + ","
			o.print username.to_s+","
			o.print "(no),"
			o.print "(no),"
			o.print notificationArray[8] + ','
			o.print notificationArray[6] + ','
			o.print 'Notify,'
			o.print "(no),"
			o.print notificationArray[3] + ','
			o.print notificationArray[10] + ','
			o.print notificationArray[1] + ','
			o.puts
		end
	end
	o.close
end

#puts p,",",ip,",",timestamp,",",username,",",req_time,",",view_time,",",action
=begin
while not f.eof
	line = f.readline
	if (/Completed 200 OK/).match( line )
		 puts(/[0-9]*(?=ms)/.match( line ))
	end
end

=end
#f.close


#return

#system("R -f response_time.r")

