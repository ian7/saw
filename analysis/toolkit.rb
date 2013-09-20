require 'date'
require 'time'
require 'erb'

def resample(input)

	time_hash={}
	normalized_hash={}
	t_zero = 0;


	input.each do |l|

		# split it into array

		if not yield(l)
			next
		end

		t = Time.parse l[2]
		t= (t.to_i/60)

		if (t_zero == 0 or t_zero > t)
			t_zero = t
		end

		if not time_hash[t]
			time_hash[t] = 1
		else
			time_hash[t] += 1
		end
	end

	# now we sort it 

	time_hash = time_hash.sort_by{ |time, count| time }

	# so we end up with a ordered timeline of event densities

	time_hash.each do |time, count|
		if time-t_zero > 200 
			next
		end
		#o.puts((time-t_zero).to_s + ", " + count.to_s)
		#puts time-t_zero
		#puts (time-t_zero).to_s + ", " + count.to_s
		normalized_hash[(time-t_zero)] = count
	end

	#puts normalized_hash
	return normalized_hash.sort_by{ |time, count| time }
end
###################################################################
def frequency(input, output_filename = nil)
	
	values_hash = {}

	input.each do |l|
		if not values_hash[ yield(l) ]
			values_hash[yield(l)] = 1
		else
			values_hash[yield(l)] = values_hash[yield(l)] + 1
		end
	end

	values_hash = values_hash.sort_by {|v,c| c}


	if output_filename
		o = File.open output_filename,'w'
		o.puts 'value, count'

		values_hash.each do |v,c|
			o.puts v.to_s + ", " + c.to_s
		end
		o.close
	end
	#puts values_hash.class
	return values_hash
end
###################################################################


def view( input, header = [] )
 
	s = File.new 'script.R','w'


	# in case what we got is a hash, then we should 
	if input.class.to_s == "Array" || input.class.to_s == "Hash"
		o = File.new 'temp.csv','w'
		
		if header.size > 0
			o.print header[0]
			i=1
			while i < header.size
				o.print ", " + header[i]
				i+=1
			end
			o.puts ""
		end

		input.each do |v,c|
			o.puts v.to_s + ", " + c.to_s
		end
		o.close
		filename = 'temp'
	else
		filename = input
	end



template = ERB.new <<-EOF
	pdf('<%= filename %>.pdf')
	reqs <- read.table(file="<%= filename %>.csv",header=TRUE, sep=",")
	plot( reqs$time, reqs$count, xlab="time[min]",ylab="reqs/min", col='red')
	dev.off()
	EOF

	s.puts  template.result(binding)
	s.close

	# render this stuff
	system 'Rscript script.R'
end


def render(input, output="out.pdf")

s = File.new 'script.R','w'

template = ERB.new <<-EOF
	pdf('<%= output %>')
	reqs <- read.table(file="<%= input %>",header=FALSE, sep=",")
	plot( reqs$V1, reqs$V2, xlab="time[min]",ylab="reqs/min", col='red')
	dev.off()
	EOF

	s.puts  template.result(binding)
	s.close

	# render this stuff
	system 'Rscript script.R'
end

def plot(lines,header=[])
	fs = frequency( lines ) {|l| yield(l)}
	#puts fs.class
	view(fs,header)
end

def dump( data, filename="dump.csv")
	o=File.new filename, 'w'
	data.each do |c,v|
		o.puts c.to_s + ", " + v.to_s
	end
	o.close()
end


def read(filename)
	f = File.new filename
	lines = []
	f.readline

	while not f.eof
		lines << f.readline.split(",")
	end
	f.close
	return lines
end
