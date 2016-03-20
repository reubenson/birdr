class ReportCollectionViewObject
  attr_reader :notice
  attr_reader :show_popular_searches

  def initialize(report_collection,params_location)
    @collection = report_collection
    @params_location = params_location
    @show_popular_searches = false
  end

  def notice
    loc = search_term? ? @collection.location : "you"

    if @collection.reports.length > 0
      msg = "#{@collection.reports.length} different bird species have been
      spotted near #{loc} in the past 30 days. Click through the list
      of birds below to display information and recent observations on the map!"
    else
      msg = "No birds have been spotted near #{loc} in the past 30 days."
      if search_term?
        msg += " Try one of our popular searches instead."
        @show_popular_searches = true
      else
        msg += " There may have been an error in obtaining your geo-coordinates. Please
        try refreshing this page, or try searching your location using the search
        bar above."
      end
    end

    return msg
  end

  def search_term?
    !!@params_location
  end

  def popular_searches
    ReportCollection.most_common_location_queries
  end

end
