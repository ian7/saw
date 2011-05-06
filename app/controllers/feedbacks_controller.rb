class FeedbacksController < ApplicationController
    before_filter :authenticate_user!

    def show
       respond_to do |format|
        format.json  { render :json => Feedback.find(params[:id]) }
      end      
    end

    def index
       respond_to do |format|
        format.json  { render :json => Feedback.all.to_json() }
      end
    end

    def edit
    end

    def new
    end

    def create
      f = Feedback.new
      f.comment = params[:comment];
      f.url = params[:url]
      f.author = params[:author]
      f.save
      
      FeedbackMailer.report().deliver
      
      respond_to do |format|
        format.json  { render :json => f }
      end      
    end

    def update
    end

    def destroy
    end


end
