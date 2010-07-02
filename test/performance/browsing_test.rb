require 'test_helper'
require 'performance_test_help'

# Profiling results for each test method are written to tmp/performance.
class BrowsingTest < ActionController::PerformanceTest
  def setup
    dt=DynamicType.find_by_name("Alternative")
    for n in 1..1000 do
      instance = dt.new_instance("Alt"+n.to_s)
      instance.save
    end
  end
  
  def test_alternatives_index
    get '/alternatives/'
  end
end
