const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models/user.model');
const { Permission } = require('../models/permission.model');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }

    const user = await User.findByPk(payload.sub, {
      include: [
        {
          association: 'userRole',
          attributes: ['id', 'name'],
          include: [
            {
              model: Permission,
              attributes: ['id', 'value'],
              through: { attributes: [] },
            },
          ],
        },
        {
          association: 'userOnboarding',
        },
        {
          association: 'userSkill',
          through: { attributes: [] },
        },
        {
          association: 'userInterest',
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
