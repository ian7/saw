require 'test_helper'

class ScopeControllerTest < ActionController::TestCase
  test "should get type" do
    get :type
    assert_response :success
  end

end
