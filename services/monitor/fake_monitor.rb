require 'json'
require 'pp'

require_relative 'db'

# dont fail silently!!!
Thread.abort_on_exception = true

module Pri
  # Fake monitor class
  class Monitor
    def initialize(*)
      @db = Db.new 'pri_data', 'sensor_data'
    end

    def process_data(frames)
      frames.each do |f|
        puts f.inspect
        @db.insert_one f
      end
    end

    def run
      sum_direction_k = 1 # stores the sign of the added offset
      loop do
        frames = []
        (0..10).each do |i|
          frames << make_fast(i, sum_direction_k)
          frames << make_slow(i, sum_direction_k)
        end
        process_data(frames)
        sum_direction_k *= -1
      end
    end

    def make_slow(idx, direction)
      temp1 = 18 + (idx * direction)
      temp2 = 18.5 + (idx * direction)
      sleep 0.5
      time = Time.now.to_i
      {
        ftype: 'S1',
        t1: temp1, t2: temp2,
        weight: 0,
        rtc_time: time,
        address: 1
      }
    end

    def make_fast(idx, direction)
      accel_x = 0.5 + ((idx / 100) * direction)
      accel_y = 0.5 + ((idx / 100) * direction)
      accel_z = 0.5 + ((idx / 100) * direction)
      sleep 0.5
      time = Time.now.to_i
      {
        ftype: 'F1',
        accel_x: accel_x, accel_y: accel_y, accel_z: accel_z,
        imu_time: time,
        time: time,
        address: 1
      }
    end
  end
end

m = Pri::Monitor.new
m.run
