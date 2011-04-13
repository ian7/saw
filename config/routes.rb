Saw::Application.routes.draw do

  get "users/new"
  get "users/edit"

  match '/auth/:provider/callback' => 'authentications#create'  
  devise_for :users, :controllers => { :registrations =>  'registrations' }  
  resources :projects  
  resources :tasks  
  resources :authentications  
  root :to => 'projects#index'  


  get "authentications/index"
  get "authentications/create"
  get "authentications/destroy"

  get "tag/index"
  get "tag/list"
  get "tag/dotag"
  get "tag/untag"
  get "tag/tree"
  get "tag/cloud"
  get "tag/type_cloud"
  get "tag/taggings_list"
  get "tag/tags_list"
  get "tag/tag_instances"

  get "wizards/capture"
  get "wizards/explore"
  get "wizards/decide"
  get "wizards/report"

  get "metrics/list"
  get "metrics/classification"
  get "metrics/descriptiveness"
  get "metrics/complexity"
  get "metrics/completeness"
  get "metrics/definiteness"

  get "relations/from"
  get "relations/to"
  get "relations/tree_to"
  get "relations/tree_to"
  get "relations/tree"
  get "relations/graph"
  get "relations/relate"
  get "relations/view"
  get "relations/list"

  resources :dynamic_types

  resources :dynamic_type_attributes
  
  resources :dynamic_type_scopes

  #connect 'tags/list', :controller=>'tags', :action=>'list'

  resources :tags
  get "tags/list"


#  connect 'taggables/search', :controller=>'taggables', :action=>'search'

  # MN: that rocks !
 # connect 'issues/:id/relations/:action', :controller=>'relations'

  # that rocks too !
#  connect 'issues/:taggable_id/tag/:action.:format', :controller=>'tag'

  resources :taggables do
    match "tag/:action(.:format)" => "tag#:action"
    get "notify"  
    match "relations/:action(.:format)" => "relations#:aaction"
  	resources :tags
  end

  resources :projects do
    resources :items do
        resources :alternatives
        match "tag/:action(.:format)" => "tag#:action"
    end
    resources :issues
    resources :alternatives
    resources :tags 
  end

  resources :alternatives

  resources :items do
    match "tag/:action(.:format)" => "tag#:action"
    resources :alternatives
    resources :tags
#    resources :relations
  end 
  

  resources :issues do
    resources :alternatives
    resources :tags
 #   resources :tag
    #get "tag/list"
    match "tag/:action(.:format)" => "tag#:action"
    
  end
  
  #match "issues/:taggable_id/tag/:action.:format" => "tag#:action.format"
  #match "issues/:taggable_id/tag/:action" => "tag#:action"


  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
   root :to => "tag#type_cloud"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
   match ':controller(/:action(/:id(.:format)))'
end
