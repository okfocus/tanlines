require 'bundler'
require 'json'

Bundler.require(:default, ENV['RACK_ENV'].to_sym)

enable :run
set :public_folder, File.dirname(__FILE__) + "/public/"

get '/videolist' do
  content_type 'text/plain'
  JSON.generate( Dir["public/*.mp4"].map {|f| f.sub('public/','').sub('.mp4','') }  )
end

get '/' do
  redirect '/index.html'
end

=begin
get '*' do
  if request.path_info.include?("..")
    "bad"
  elsif File.directory?("public" + request.path_info)
    @dir = request.path_info
    if @dir and @dir != "/"
      @parent = request.path_info.sub(/\/$/,'').sub(/\/[^\/]+$/,'')
      @parent = "/" unless @parent and @parent.length > 0
    end
    @files = Dir["public" + request.path_info + "/*"].map {|f|
      stat = File.stat(f)
      {
      :dir? => File.directory?(f) ? 0 : 1,
      :name => f.gsub(/.*\//,''),
      :href => f.gsub('public/',''),
      :size => stat.size,
      :date => stat.mtime.strftime("%Y-%m-%d %I:%M%p").downcase.sub("m","")
      }
    }.sort_by!{ |f| f[:dir?] }
    erb :index
  else
    "404"
  end
end
=end

