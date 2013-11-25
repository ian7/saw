#require_relative './indicators/M1.rb'
#require_relative './indicators/M2.rb'
Dir.glob(File.expand_path("../indicators/M*.rb", __FILE__)).each do |file|
  require file
end
