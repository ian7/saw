class MetricMatrix < Array
	def setHeaders( headers)
		@headers = headers
	end
	def getHeaders
		return @headers
	end
	def get( name )
		return @headers.index {|x| x.strip == name}
	end
	def save( filename )
		f = File.open filename,'w'
		f.puts @headers.join("\t") + "\n"
		each{ |x| 
			f.puts x.join("\t") + "\n"
		}
		f.close()
	end
	def load( filename )
		f = File.open filename,'r'
		setHeaders( f.readline.split("\t") )
		begin
			push MetricRow.new( f.readline.split("\t"), @headers )
		end while not f.eof
		f.close()
	end
end


class MetricRow < Array
	def initialize( content, headers )
		@headers = headers
		super( content )
	end
	def []( name )
		return self.fetch( @headers.index {|x| x.strip==name} )
	end	
end