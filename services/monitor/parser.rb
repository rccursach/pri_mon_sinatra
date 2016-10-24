
class Parser
  def initialize
  end
  def parse_binstr binstr
    delimiter = [0xFE, 0xFE].pack('c*')
    id_fast = [0xAA, 0xAA].pack('c*')
    id_slow = [0xBB, 0xBB].pack('c*')

    packets_arr = binstr.split(delimiter)
    #puts packets_arr.inspect

    fast_packets = []
    slow_packets = []

    packets_arr.each_with_index do |p|
      
      p.gsub!(delimiter, '');
      
      if p.start_with?(id_slow)
        slow_packets << p.gsub(id_slow, '')
      elsif p.start_with?(id_fast)
        fast_packets << p.gsub(id_fast, '')
      end
          
    end

    #puts fast_packets.inspect
    #puts slow_packets.inspect

    res = []
    parse_fast(fast_packets).each do |p|
      res << p
    end
    parse_slow(slow_packets).each do |p|
      res << p
    end

    #puts res.inspect
    return res

  end

  def parse_fast fast_arr
    fast_objs = []
    parse_time = Time.now.to_f
    fast_arr.each do |p|
      accel_x = p[0..1].unpack('s>')[0]
      accel_y = p[2..3].unpack('s>')[0]
      accel_z = p[4..5].unpack('s>')[0]

      # gyro_x = p[6..7].unpack('s>')[0]
      # gyro_y = p[8..9].unpack('s>')[0]
      # gyro_z = p[10..11].unpack('s>')[0]

      # imu_time = p[12..15].reverse().unpack('L')[0]
      imu_time = p[6..9].reverse().unpack('L')[0]

      ## removed from hash:
      #gyro_x: gyro_x, gyro_y: gyro_y, gyro_z: gyro_z,

      fast_objs << {
        ftype: 'F1',
        accel_x: accel_x, accel_y: accel_y, accel_z: accel_z,
        imu_time: imu_time,
        time: parse_time
       }
    end

    #sort by imu_time and fix datetime difference
    # fast_objs.sort_by { |hsh| hsh[:imu_time] }
    fast_objs.each_with_index { |o, i|
      if i > 0
        o[:time] += ((o[:imu_time] - fast_objs[0][:imu_time])/10e6)
      end
    }

    return fast_objs
  end

  def parse_slow slow_arr
    slow_objs = []
    slow_arr.each do |p|
      temp1 = p[0..1].unpack('s>')[0] / 16.0
      temp2 = p[2..3].unpack('s>')[0] / 16.0
      weight = p[4..7].unpack('l>')[0] #this one is signed long
      rtc_time = p[8..11].reverse().unpack('L')[0]

      slow_objs << {
        ftype: 'S1',
        t1: temp1, t2: temp2,
        weight: weight,
        rtc_time: rtc_time
      }
    end
    return slow_objs
  end


end