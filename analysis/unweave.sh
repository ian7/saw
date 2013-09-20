
# this fishes out all process ids used and turns them into a list stored in the IDS variable
IDS=`cat $1 |awk '/^[0-9]+/ {printf $1"\n"}' |sort |uniq`


for ID in $IDS; do
	# sed magic folds double newline occuring before "Started"
	sed -n -e ":a" -e "$ s/\n\n//gp;N;b a" $1 | grep ^$ID 
done