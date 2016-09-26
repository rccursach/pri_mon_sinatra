
require 'getoptlong'
require_relative 'monitor'

opts = GetoptLong.new(
  [ '--device', '-d', GetoptLong::REQUIRED_ARGUMENT ],
  [ '--speed', '-s', GetoptLong::REQUIRED_ARGUMENT ]
)

dev = nil
speed = nil

opts.each do |opt, arg|
 case opt
 when '--device'
   dev = arg
 when '--speed'
   speed = arg.to_i
 end 
end

if speed.nil?
  puts 'speed is nil'
  exit 0
end



mon = Pri::Monitor.new dev, speed
mon.run
