class ReportCollectionController < ApplicationController

  def create
    location = params[:location] || (request.remote_ip=='::1'? "Prospect Park, NY" : request.remote_ip)
    location = location.split.each(&:capitalize!).join(' ')
    @collection = ReportCollection.create(location: location)
    @collection.location = @collection.location.split.collect{|str| str.length!=2 ? str.capitalize : str.upcase}.join(' ')
    eBirdClient = Adapters::EbirdClient.new
    @collection.reports = eBirdClient.find_by_location(@collection.latitude,@collection.longitude)
    loc = params[:location] ? @collection.location : "you"
    notice_msg = "#{@collection.reports.length} different bird species have been
      spotted near #{loc} in the past 30 days. Click through the list
      of birds below to display recent observations on the map!"
    flash[:notice] = notice_msg
    render 'application/root'
  end
end

private

def collection_params
  params.require(:report_collection).permit(:query)
end
