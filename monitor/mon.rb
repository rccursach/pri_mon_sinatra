require "ruxbee"
require "pp"
require "getoptlong"
require_relative "parser"
require_relative "cache"
require_relative "db"
require "json"

opts = GetoptLong.new(
  [ '--device', '-d', GetoptLong::REQUIRED_ARGUMENT ],
  [ '--speed', '-s', GetoptLong::REQUIRED_ARGUMENT ]
)

@dev = nil
@speed = nil

opts.each do |opt, arg|
 case opt
 when '--device'
   @dev = arg
 when '--speed'
   @speed = arg.to_i
 end 
end

if @speed.nil?
  puts "speed is nil"
  exit 0
end

class Monitor

  def initialize dev, speed
    @xbee = XBee.new dev, speed, :API_S1
    @parser = Parser.new
    cache_opt = {host: 'localhost', port: 6379}
    @cache = PRI_FRUTAS::Cache.new cache_opt[:host], cache_opt[:port], 'pri_nodes', 'pri_reg'
    @db = Db.new 'pri_data', 'sensor_data'
  end

  def process_data res
    if not res.nil? and res.api_identifier == '81'
      res = {rssi: res.rssi, address: res.address_16_bits, api_frame_id: res.api_identifier, data: res.cmd_data}
      #pp res
      packets = @parser.parse_binstr res[:data]
      packets.each do |p|
        # pp p
        @cache.update_node res[:address].to_s, p.to_json
        # @cache.insert_data res[:address].to_s, p.to_json
        @db.insert_one p
      end
    elsif not res.nil? and res.api_identifier != '81'
      puts "DEBUG: got XBee/ZigBee frame with #{res.api_identifier}"
    end
  end

  def run
    loop do
      begin
        res = @xbee.getresponse
        Thread.new(res, &method(:process_data))
      rescue => e
        puts e
      end
    end
  end

end

mon = Monitor.new @dev, @speed
mon.run
