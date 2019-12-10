import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { id: student_id } = req.params;

    /** Ckeck params */
    if (!student_id) {
      return res.status(400).json({ error: 'Student invalid' });
    }

    const student = await Student.findByPk(student_id);

    /** Check student is valid */
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const checkinsStudent = await Checkin.findAll({
      where: { student_id },
      order: [['created_at', 'DESC']],
    });

    return res.json(checkinsStudent);
  }

  async store(req, res) {
    const { id: student_id } = req.params;

    /** Ckeck params */
    if (!student_id) {
      return res.status(400).json({ error: 'Student invalid' });
    }

    const student = await Student.findByPk(student_id);

    /** Check student is valid */
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }
    const dateNow = new Date();
    const checkinCount = await Checkin.count({
      where: {
        student_id,
        created_at: {
          [Op.between]: [subDays(dateNow, 7), dateNow],
        },
      },
    });

    if (checkinCount >= 5) {
      return res
        .status(400)
        .json({ error: 'you exceeded you limit to 5 check in in 7 days ' });
    }
    const checkin = await Checkin.create({ student_id });

    return res.json(checkin);
  }
}
export default new CheckinController();
