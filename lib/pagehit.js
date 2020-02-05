/*
page hit object
call count() method to increment counter and return total hits

Count data is stored in a MySQL database named `pagehit-orm` in the `hit` table.
Execute init.sql on first use.
*/

'use strict';

const
  // modules
  httpReferrer = require('./httpreferrer'),

  // Sequelize ORM (MySQL)
  Sequelize = require('sequelize'),
  sequelize = new Sequelize(
    'pagehit-orm',
    'root',
    'mysecret',
    {
      host: 'mysql',
      dialect: 'mysql'
    }
  );

// define Hit class
class Hit extends Sequelize.Model {}
Hit.init(
  {

    hash: {
      type: Sequelize.STRING(32),
      allowNull: false
    },
    ip: {
      type: Sequelize.STRING(15),
      allowNull: true
    },
    ua: {
      type: Sequelize.STRING(200),
      allowNull: true
    }

  },
  {
    indexes: [
      { fields: ['hash', 'createdAt'] }
    ],
    sequelize,
    modelName: 'hit'
  }

);

// synchronize model with database
(async () => {
  await sequelize.sync();
})();


module.exports = class {

  // increase URL counter
  async count(req) {

    let
      hash = httpReferrer(req),
      count = null;

    if (!hash) return count;

    // fetch IP address and user agent
    const
      ipRe  = req.ip.match(/(?:\d{1,3}\.){3}\d{1,3}/),
      ip    = ipRe.length ? ipRe[0] : null,
      ua    = req.get('User-Agent') || null;

    try {

      // store page hit
      await Hit.create(
        { hash, ip, ua }
      );

      // fetch page hit count
      let res = await Hit.findAndCountAll({
        where: { hash }
      });

      count = res.count;

    }
    catch (err) {
      console.log('DB error', err);
    }

    // return counter
    return count;
  }

};
