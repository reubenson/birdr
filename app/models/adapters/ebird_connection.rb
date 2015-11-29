module Adapters
	class EbirdConnection
		include HTTParty

		def initialize
			@connection = self.class
		end

		def species_query(species)
			longitude = -73.96
			latitude = 40.65
			query_string = "http://ebird.org/ws1.1/data/obs/geo_spp/recent?lng=#{longitude}&lat=#{latitude}&dist=50&back=30&sci=#{species}&fmt=json"
			# query_string = "http://ebird.org/ws1.1/data/obs/geo/recent?lng=#{longitude}&lat=#{latitude}&dist=20&back=30&fmt=json"
			results = @connection.get(query_string)
			data = RecursiveOpenStruct.new({data: results}, :recurse_over_arrays => true).data
		end

		def location_query(latitude,longitude)
			# query_string = "http://ebird.org/ws1.1/data/obs/geo_spp/recent?lng=#{longitude}&lat=#{latitude}&dist=50&back=30&sci=#{species}&fmt=json"
			query_string = "http://ebird.org/ws1.1/data/obs/geo/recent?lng=#{longitude}&lat=#{latitude}&dist=50&back=30&fmt=json"
			results = @connection.get(query_string)
			data = RecursiveOpenStruct.new({data: results}, :recurse_over_arrays => true).data
		end
	end
end
