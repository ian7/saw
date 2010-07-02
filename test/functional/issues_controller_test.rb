require File.dirname(__FILE__) + '/../test_helper'
#require 'test_helper'
require 'issues_controller'

class IssuesControllerTest < ActionController::TestCase
    fixtures :taggables
  
  def setup
    @controller = IssuesController.new
    @request = ActionController::TestRequest.new
    @response = ActionController::TestResponse.new
  end
  
  test "getting index" do
    get :index
    assert_response :success
    
    # and there we count the items in the index.
    #assert_tag :tag => "table", :children=> { :count=>1, :only=> {:tag=>"th"}}    
    assert_not_nil assigns(:issues)
  end
  
  test "should get new issue" do
    get :new
    assert_response :success
  end
  
  test "should create issue" do
    assert_difference('DynamicType.find_by_name("Issue").count') do
      post :create, :issue => { :id=>"123", :name=>"tralala", :comment=>"xxx"}
    end
    
    #assert_redirected_to r1_path(assigns(:r1))
  end
  
  test "should show issue" do
   # TODO: that is quite ugly.... i should work more on the 
       
    get :show, :id => Taggable.find(:all, :conditions=>{:type=>"Issue"})[0].to_param
    assert_response :success
  end
  
  test "should get edit" do
    # TODO: that is quite ugly.... i should work more on the 
    
    get :edit, :id => Taggable.find(:all, :conditions=>{:type=>"Issue"})[0].to_param
    assert_response :success
  end
  
  test "should update issue" do
    # TODO: that is quite ugly.... i should work more on the
 
    id = Taggable.find(:all, :conditions=>{:type=>"Issue"})[0].to_param
 
    put :update, :id => id , :issue=> { :name=>"new_name" }
    
    assert_redirected_to "/issues/"+id.to_s
  end
  
  test "should destroy issue" do
    assert_difference('Taggable.find(:all, :conditions=>{:type=>"Issue"}).size', -1) do
      delete :destroy, :id =>  Taggable.find(:all, :conditions=>{:type=>"Issue"})[0].to_param
    end
    
    assert_redirected_to "/issues"
  end
  
end
