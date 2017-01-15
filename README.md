# pri_monitor
* [Running the application](#running-the-application)
* [Installing the application and dependencies:](#installing-the-application-and-dependencies)
  * [Install System Dependencies](#install-system-dependencies)
  * [Install Project Dependencies](#install-project-dependencies)
  
--

## Running the application:

*Please do not copy the shell prompt symbol ($) !!*

  * XBee listener:
  
  First find out your speed in bauds and wich device *(maybe `dmesg | tail -n 20` right after connecting the usb?)*
  
  ```bash
  $ ruby ./services/mon.rb --speed 57600 --device /dev/ttyUSB0
  ```
  
  * WEB Application server:
  ```bash
  $ ruby ./app.rb
  ```
  
  * WEB UI:
  
  Just open [http://localhost:4321](http://localhost:4321)
  
--

## Installing the application and dependencies:

* Clone the repo:
```bash
$ git clone https://github.com/rccursach/pri_monitor.git
```

--

### Install System Dependencies:

  *Please do not copy the shell prompt symbol ($) !!*
  
  * RVM:
    * Install hombrew on MacOS and then RVM:
    
    ```bash
    $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    $ brew update && brew install rvm
    ```
    * Or on Linux (Debian/Ubuntu):
    
    ```bash
    $ sudo apt-get update && sudo apt-get install curl git build-essential
    $ gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
    $ \curl -sSL https://get.rvm.io | bash -s stable
    ```

  * Node.JS & Bower:
    * MacOS:
    ```bash
    $ brew install node
    $ npm install -g bower
    ```
    
    * Linux (Debian/Ubuntu):
    ```bash
    $ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
    $ sudo apt-get install -y nodejs
    $ npm install -g bower
    ```
    
  * MongoDB and Redis:
    * MacOS:
    ```bash
    $ brew install redis mongodb
    ```
    
    * Linux (Debian/Ubuntu):
      * [For Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-14-04)
      * [For Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04)

--

### Install Project Dependencies:

*Please do not copy the shell prompt symbol ($) !!*

*First enter the project directory: `$ cd pri_monitor`*

  * Install the application's ruby
    ```bash
    $ rvm install ruby-2.2.4
    ```
    
  * Install server-side (ruby) dependencies
    ```bash
    $ gem install bundler && bundle install
    ```
  
  * Install client-side (js/css) dependencies
    ```
    $ bower install
    ```
--

*The required dependencies are now installed. You may want to see [Running the application](#running-the-application) now.*
