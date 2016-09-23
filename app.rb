$LOAD_PATH.unshift("#{File.dirname(__FILE__)}/lib")

require 'rubygems'
require 'sinatra'
require 'thin'
require 'pri_node'
require 'json'
require 'db'

##
# App class
#
class App < Sinatra::Base

  def initialize
    super
    # Manage nodes data
    @n = PRI_Frutas::Node.new
    @db = Db.new 'pri_data', 'sensor_data'
  end

  get "/" do
   erb :index
  end

  get "/nodes" do
    erb :nodes
  end

  get "/api/nodes" do
    @n.get_all
  end

  get "/api/nodes/:id_str/data" do
    id_str = params[:id_str]
    @n.get_all_node id_str
  end

  get "/api/nodes/fast" do
    JSON.generate @db.get_last_hour(:fast)
  end

  get "/api/nodes/slow" do
    JSON.generate @db.get_last_hour(:slow)
  end

  get "/feed" do
    return @n.get_all().to_a().to_json
  end

  post "/send" do
    cmd = params["cmd"]
    if cmd.nil?
      status 400
      puts "[#{Time.now.to_s}] /send: no command given"
    else
      puts "[#{Time.now.to_s}] /send: pushing this command to queue => #{cmd}"
      @n.push_cmd cmd
      status 200
    end
  end

  post "/send_multi" do
    cmds = params["cmds"]
    if cmds.nil?
      status 400
      puts "[#{Time.now.to_s}] /send_multi: no command array given for"
    else
      puts "[#{Time.now.to_s}] /send_multi: pushing this commands to queue => #{cmds}"
      cmds.each do |cmd|
        @n.push_cmd cmd
      end
      status 200
    end
  end

  # get "/*" do
  #   erb :index
  # end

end


dispatch = Rack::Builder.app do
  map '/' do
    run App.new
  end
end

# Start the web server. Note that you are free to run other tasks
# within your EM instance.
Rack::Server.start({
  app:    dispatch,
  server: 'thin',
  Host:   '0.0.0.0',
  Port:   '4567',
  signals: false,
})