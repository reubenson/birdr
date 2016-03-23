class ReportCollection < ActiveRecord::Base
  # has_many :reports
  attr_accessor :reports
  geocoded_by :address
  after_initialize :geocode

  def reports_sorted_alphabetically
    self.reports.sort{|x,y| x.com_name <=> y.com_name}
  end

  def centroid
    lats = []
    lngs = []
    self.reports.each do |report|
      lats << report.lat
      lngs << report.lng
    end

    [ lats.inject{|sum,lat| sum+lat}/lats.length , lngs.inject{|sum,lng| sum+lng}/lngs.length ]
  end

  def species_list
    self.reports.pluck(:com_name)
  end

  def search_species
    self.reports.where('com_name LIKE (?)',"%#{self.query}")
  end

  def address
    if !self.location
      self.location = "Prospect Park, NY"
    end

    self.location
  end

  def format_location
    self.location = self.location.split.each(&:capitalize!).join(' ')
    self.location = self.location.split.collect{|str| str.length!=2 ? str.capitalize : str.upcase}.join(' ')
  end

  def self.location_queries_sort_popularity
    ReportCollection.where.not(query:nil)
      .select('report_collections.query, count(report_collections.query) as query_count')
      .group(:query)
      .order('query_count desc')
  end

  def self.most_common_location_queries
    self.location_queries_sort_popularity.first(3).map{|obj| obj.query}
  end

end
