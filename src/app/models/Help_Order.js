import Sequelize, { Model } from 'sequelize';

class Help_Order extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.STRING,
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE,
      },
      {
        tableName: 'help_orders',
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Student, { foreignKey: 'id' });
  }
}

export default Help_Order;
