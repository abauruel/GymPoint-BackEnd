import * as Yup from 'yup';
import Help_Order from '../models/Help_Order';
import Queue from '../../lib/Queue';
import AnsweredMailJob from '../jobs/AnsweredMail';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const helpordersWithoutanswer = await Help_Order.findAll({
      where: {
        answer: null,
      },
      attributes: ['id', 'student_id', 'question', 'answer', 'answer_at'],
    });
    if (!helpordersWithoutanswer) {
      return res.status(200).json({ message: 'You no have request for help' });
    }

    return res.json(helpordersWithoutanswer);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation is failed' });
    }

    const { id: student_id } = req.params;
    if (!student_id) {
      return res.status(400).json({ error: 'Student is required' });
    }

    const { question } = req.body;

    const help_order = await Help_Order.create({
      student_id,
      question,
    });

    return res.json(help_order);
  }

  async show(req, res) {
    const { id: student_id } = req.params;
    const myHelp_orders = await Help_Order.findAll({
      where: {
        student_id,
      },
      attributes: ['id', 'student_id', 'question', 'answer', 'answer_at'],
    });

    return res.json(myHelp_orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation is failed' });
    }
    const { id } = req.params;
    const { answer } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Order is required' });
    }

    const help_order = await Help_Order.findOne({
      where: {
        id,
        answer: null,
      },
      include: [{ model: Student, attributes: ['name', 'email'] }],
    });

    if (!help_order) {
      return res
        .status(400)
        .json({ error: 'Order does not exist or has already been answered' });
    }
    const { name, email } = help_order.Students[0];

    const help_order_answered = await help_order.update({
      answer,
      answer_at: new Date(),
    });

    await Queue.add(AnsweredMailJob.key, { help_order_answered, name, email });

    return res.json(help_order_answered);
  }
}

export default new HelpOrderController();
