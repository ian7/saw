# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_rails3_session',
  :secret      => '0a8572272c3ebcd94a9c1ca346f6f888fc0299cb41adcab94aa48bae986683fce075864a03716b5949a7eed14389e016ebc2854297204d0f5fbf489745fc251c'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
