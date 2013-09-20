# reqs/time stats 


reqs <- read.table(file="reqs_in_time.log",header=TRUE, sep=",")
gets <- read.table(file="reqs_in_time-gets.log",header=TRUE, sep=",")
puts <- read.table(file="reqs_in_time-puts.log",header=TRUE, sep=",")
posts <- read.table(file="reqs_in_time-posts.log",header=TRUE, sep=",")

plot( reqs$time, reqs$count, xlab="time[min]",ylab="reqs/min")
lines( gets$time, gets$count, type="p",col="red")
lines( puts$time, puts$count, type="p",col="green" )
lines( posts$time, posts$count, type="p",col="blue" )