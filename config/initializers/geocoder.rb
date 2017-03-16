Geocoder.configure({
  # :lookup => :google,
  :ip_lookup => :freegeoip,
  lookup: :bing,
  api_key: ENV['BING_GEOCODE_ID'],
  :timeout => 20
})
