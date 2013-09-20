#!/usr/bin/ruby

f=File.new 'log'
while not f.eof
	line = f.readline
	if (/Completed 200 OK/).match( line )
		 puts(/[0-9]*(?=ms)/.match( line ))
	end
end
f.close

#system("R -f response_time.r")