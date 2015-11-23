module Adapters
	class EbirdConnection
		include HTTParty

		def initialize
			@connection = self.class
		end

		def query(species)
			longitude = -73.96
			latitude = 40.65
			query_string = "http://ebird.org/ws1.1/data/obs/geo_spp/recent?lng=#{longitude}&lat=#{latitude}&dist=50&back=30&sci=#{species}&fmt=json"
			results = @connection.get(query_string)
			data = RecursiveOpenStruct.new({data: results}, :recurse_over_arrays => true).data
		end
	end
end