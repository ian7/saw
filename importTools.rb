f=File.open("tools")

while not f.eof
	toolname = f.readline
	p.fork( toolname )
end