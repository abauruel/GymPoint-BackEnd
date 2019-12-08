import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.NUMBER,
        price: Sequelize.NUMBER,
      },
      {
        sequelize,
      }
    );
  }
}

export default Plan;
