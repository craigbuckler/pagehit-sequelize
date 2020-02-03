# PageHit (MySQL database, Sequelize ORM)

A page hit counter service which saves data to a MySQL database using the Sequelize ORM.

This is an example project for the purposes of demonstration only. It is not recommended for production use!

[Docker](https://www.docker.com/) and Docker Compose are required. Enter `docker-compose up` to build and launch MySQL, Adminer, NGINX, and Node.js development containers.

Once started, [load any page](http://localhost:8888/) to test four methods of adding a hit counter:

* <http://localhost:8888/page-svg.html>
* <http://localhost:8888/page-jswrite.html>
* <http://localhost:8888/page-jsdefer.html>
* <http://localhost:8888/page-jsajax.html>
