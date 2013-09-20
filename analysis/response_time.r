

c=read.table(file="i",col.names=c('t'))
hist(log(c$t,10),20)
cairo_pdf(file='response_time.pdf')