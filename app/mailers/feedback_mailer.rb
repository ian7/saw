class FeedbackMailer < ActionMailer::Base
  default :from => "saw@sonyx.net"
  
  def report()
    @url  = "http://example.com/login"
    mail(:to => "Marcin.Nowak@sonyx.net", :subject => "Welcome to My Awesome Site")
  end

  def feedback( f )
    #@url  = "http://example.com/login"
    @f = f
    mail(:to => "Marcin.Nowak@sonyx.net", :subject => "This is Software Architecture Warehouse user feedback notification")
  end
end
