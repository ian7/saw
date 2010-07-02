require 'test_helper'

class DynamicTypeScopesControllerTest < ActionController::TestCase
 fixtures :dynamic_type_scopes
  
  def test_create
    assert_difference('DynamicTypeScope.count') do
      post :create, :dynamic_type_scope => { :type_name=>"dtName" }
    end
  end
  
  def test_destroy
    assert_difference('DynamicTypeScope.count', -1) do
      delete :destroy, :id => DynamicTypeScope.first.to_param
    end
  end

  def test_edit
      get :edit, :id => DynamicTypeScope.first.to_param
      assert_response :success   
  end

  def test_index
    get :index
    assert_response :success
    assert_not_nil assigns(@dynamic_type_scopes)
  end

  def test_new
      get :new
      assert_response :success  
  end

  def test_show
    get :show, :id => DynamicTypeScope.first.to_param
    assert_response :success  
  end
  
  def test_update
    put :update, :id => DynamicTypeScope.first.to_param, :dynamic_type_scope => { :type_name=>"anotherDTname"}
    assert_redirected_to dynamic_type_scope_path(DynamicTypeScope.first.to_param)
  end

end
