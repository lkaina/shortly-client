require 'sinatra'
require "sinatra/reloader" if development?
require 'active_record'
require 'digest/sha1'
require 'pry'
require 'uri'
require 'open-uri'
# require 'nokogiri'

###########################################################
# Configuration
###########################################################

set :public_folder, File.dirname(__FILE__) + '/public'

configure :development, :production do
    ActiveRecord::Base.establish_connection(
       :adapter => 'sqlite3',
       :database =>  'db/dev.sqlite3.db'
     )
end

# Handle potential connection pool timeout issues
after do
    ActiveRecord::Base.connection.close
end

# turn off root element rendering in JSON
ActiveRecord::Base.include_root_in_json = false

###########################################################
# Models
###########################################################
# Models to Access the database through ActiveRecord.
# Define associations here if need be
# http://guides.rubyonrails.org/association_basics.html

class Link < ActiveRecord::Base
    attr_accessible :url, :code, :visits, :title

    belongs_to :user

    has_many :clicks

    validates :url, presence: true

    before_save do |record|
        record.code = Digest::SHA1.hexdigest(url)[0,5]
    end
end

class Click < ActiveRecord::Base
    belongs_to :link, counter_cache: :visits, :touch => true
end

class User < ActiveRecord::Base
    attr_accessible :username, :password

    has_many :links
end


###########################################################
# Routes
###########################################################
enable :sessions

get '/' do
    erb :login
end

post '/' do
    if params[:register].nil?
        user = User.find_by_username(params[:username])
        if user.password == params[:password]
            session[:username] = user.username
            redirect '/home'
        else
            [404, "Error"]
        end
    else
        user = User.new(username: params[:username], password: params[:password])
        session[:username] = user.username
        if user.save
            redirect '/home'
        else
            redirect '/'
        end
    end
end

get '/home' do
    erb :index
end

get '/create' do
    erb :index
end

get '/links' do
    user = User.find_by_username(session[:username])
    links = user.links.all
    links.map { |link|
        link.as_json.merge(base_url: request.base_url)
    }.to_json
end

post '/links' do
    data = JSON.parse request.body.read
    uri = URI(data['url'])
    raise Sinatra::NotFound unless uri.absolute?
    user = User.find_by_username(session[:username])
    link = user.links.find_by_url(uri.to_s) ||
           user.links.create( url: uri.to_s, title: get_url_title(uri), user_id: user.id)
    link.touch
    link.as_json.merge(base_url: request.base_url).to_json
end

get '/:url' do
    link = Link.find_by_code params[:url]
    raise Sinatra::NotFound if link.nil?
    link.clicks.create!
    redirect link.url
end

get '/:code/stats' do
    @link = Link.find_by_code params[:code]
    erb :stats
end

###########################################################
# Utility
###########################################################

def read_url_head url
    head = ""
    url.open do |u|
        begin
            line = u.gets
            next  if line.nil?
            head += line
            break if line =~ /<\/head>/
        end until u.eof?
    end
    head + "</html>"
end

def get_url_title url
    # Nokogiri::HTML.parse( read_url_head url ).title
    result = read_url_head(url).match(/<title>(.*)<\/title>/)
    result.nil? ? "" : result[1]
end
