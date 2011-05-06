class FeedbackMailer < ActionMailer::Base
  default :from => "saw@sonyx.net"
  
  def report()
    @url  = "http://example.com/login"
    mail(:to => "Marcin.Nowak@sonyx.net", :subject => "Welcome to My Awesome Site")
  end
end
