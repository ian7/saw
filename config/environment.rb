# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Saw::Application.initialize!

Juggernaut.redis_options[:host]="juggernaut.sonyx.net"
Juggernaut.redis_options[:password]="3f8be742734892ec49be818ba75744fb"
