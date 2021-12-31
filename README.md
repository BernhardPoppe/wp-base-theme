# wp-base-theme

This is my base for Wordpress Theme Developement.

## Installation

With Docker installed and running, in Terminal:

````
git clone https://github.com/davidyeiser/docker-wordpress-theme-setup.git
cd docker-wordpress-theme-setup
````

Then:

````
docker-compose up -d
````

Then in your browser:
````
http://localhost:8000/
````


Then open the theme-folder in Terminal and type:
````
npm install
````

To delete the docker-database and the wp-install, exit docker with
````
docker-compose down -v
````

