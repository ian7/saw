	pdf('dumps/marcin.nowak@sonyx.net.pdf')
	reqs <- read.table(file="dumps/marcin.nowak@sonyx.net.csv",header=FALSE, sep=",")
	plot( reqs$V1, reqs$V2, xlab="time[min]",ylab="reqs/min", col='red')
	dev.off()
