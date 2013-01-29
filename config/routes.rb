Saw::Application.routes.draw do



  get "welcome/index"

  get "notify/:id/:attribute/:event" => 'notify#notify'
  get "notify/:id/:event" => 'notify#notify'

# that's kind of highly experimental
  match "scope/type/:type_name" => 'scope#type'
#  match "scope/type/:type_name/:id" => 'r'

  resources :r, :path => 'scope/type/:type_name/r'

#scope "admin", :as => "admin" do
#  resources :photos, :accounts
#end
  get 'r/:id/relations_to' => 'r#relations_to'
  get 'r/:id/relations_from' => 'r#relations_from'
 
  get 'r/:id/relations_to/:type' => 'r#relations_to'
  get 'r/:id/relations_from/:type' => 'r#relations_from'

  get 'r/:id/related_to' => 'r#related_to'
  get 'r/:id/related_from' => 'r#related_from'
 
  get 'r/:id/related_to/:type' => 'r#related_to'
  get 'r/:id/related_from/:type' => 'r#related_from'

  get 'r/:item_id/dotag' => 'tag#dotag'
  get 'r/:item_id/untag' => 'tag#untag'

  get 'r/:id/:attribute' => 'r#attribute'
  put 'r/:id/:attribute' => 'r#setAttribute'

  post 'r/:id/notify' => 'r#postNotify'

  resources :r
  resources :t

  resources :feedbacks

  get "users/new"
  get "users/edit"
  get "users/login_failed"

  match '/auth/:provider/callback' => 'authentications#create'  
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks", :registrations =>  'registrations' }  
  resources :projects  
  resources :tasks  
  resources :authentications  
#  root :to => 'projects#index'  
  root :to => 'welcome#index'


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

  match "/search/:keyword" => "search#search"

  resources :rationales

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
        resources :alternatives do
          match "relations/:action(.:format)" => "relations#:action"        
        end
        match "tag/:action(.:format)" => "tag#:action"
    end
    resources :issues do
        match "tag/:action(.:format)" => "tag#:action"
    end
    resources :alternatives
    resources :tags 
  end
  get "projects/:id/export" => "projects#export"
  put "projects/:id/import" => "projects#import"
  get "projects/:id/report" => "projects#report"
  get "projects/:id/report2" => "projects#report2"

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
  # root :to => "tag#type_cloud"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
   match ':controller(/:action(/:id(.:format)))'
end
